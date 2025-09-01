'use client';

import { useState, useRef, useEffect } from 'react';
import { Block, ListItem } from '../../../lib/types';

interface ListBlockProps {
  block: Block;
  isSelected: boolean;
  isFocused: boolean;
  onUpdate: (updates: Partial<Block>) => void;
  onFocus: () => void;
  onBlur: () => void;
  onEnterKey: () => void;
  onBackspaceKey: () => void;
}

export function ListBlock({ 
  block, 
  isSelected, 
  isFocused, 
  onUpdate, 
  onFocus, 
  onBlur,
  onEnterKey,
  onBackspaceKey 
}: ListBlockProps) {
  const [focusedItemIndex, setFocusedItemIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLInputElement | null)[]>([]);
  const listItems = block.properties?.listItems || [];

  useEffect(() => {
    if (isFocused && focusedItemIndex === null && listItems.length > 0) {
      setFocusedItemIndex(0);
    }
  }, [isFocused, focusedItemIndex, listItems.length]);

  useEffect(() => {
    if (focusedItemIndex !== null && itemRefs.current[focusedItemIndex]) {
      itemRefs.current[focusedItemIndex]?.focus();
    }
  }, [focusedItemIndex]);

  const updateListItems = (newItems: ListItem[]) => {
    onUpdate({
      properties: {
        ...block.properties,
        listItems: newItems,
      },
    });
  };

  const handleItemChange = (index: number, content: string) => {
    const newItems = [...listItems];
    newItems[index] = { ...newItems[index], content };
    updateListItems(newItems);
  };

  const handleItemCheck = (index: number, checked: boolean) => {
    const newItems = [...listItems];
    newItems[index] = { ...newItems[index], checked };
    updateListItems(newItems);
  };

  const addNewItem = (afterIndex: number) => {
    const newItem: ListItem = {
      id: `item_${Date.now()}`,
      content: '',
      indentLevel: 0,
      ...(block.type === 'checkList' ? { checked: false } : {}),
    };
    
    const newItems = [...listItems];
    newItems.splice(afterIndex + 1, 0, newItem);
    updateListItems(newItems);
    setFocusedItemIndex(afterIndex + 1);
  };

  const removeItem = (index: number) => {
    if (listItems.length === 1) {
      onBackspaceKey();
      return;
    }
    
    const newItems = listItems.filter((_, i) => i !== index);
    updateListItems(newItems);
    
    const newFocusIndex = Math.max(0, index - 1);
    setFocusedItemIndex(newFocusIndex);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (listItems[index].content.trim() === '') {
        // Empty item - convert to paragraph
        onEnterKey();
      } else {
        // Add new item
        addNewItem(index);
      }
    }
    
    if (e.key === 'Backspace' && listItems[index].content === '') {
      e.preventDefault();
      removeItem(index);
    }
    
    if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault();
      setFocusedItemIndex(index - 1);
    }
    
    if (e.key === 'ArrowDown' && index < listItems.length - 1) {
      e.preventDefault();
      setFocusedItemIndex(index + 1);
    }
    
    if (e.key === 'Tab') {
      e.preventDefault();
      // Handle indentation (could be enhanced)
      const newItems = [...listItems];
      const currentLevel = newItems[index].indentLevel;
      newItems[index] = {
        ...newItems[index],
        indentLevel: e.shiftKey ? Math.max(0, currentLevel - 1) : Math.min(3, currentLevel + 1),
      };
      updateListItems(newItems);
    }
  };

  const handleFocus = (index: number) => {
    setFocusedItemIndex(index);
    onFocus();
  };

  const handleBlur = () => {
    setFocusedItemIndex(null);
    onBlur();
  };

  const getListIcon = (index: number) => {
    switch (block.type) {
      case 'bulletList':
        return <span className="text-gray-400">•</span>;
      case 'numberedList':
        return <span className="text-gray-400 text-sm">{index + 1}.</span>;
      case 'checkList':
        return (
          <input
            type="checkbox"
            checked={listItems[index]?.checked || false}
            onChange={(e) => handleItemCheck(index, e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        );
      default:
        return <span className="text-gray-400">•</span>;
    }
  };

  return (
    <div className={`
      group relative rounded-md transition-all duration-200
      ${isSelected ? 'bg-blue-50 ring-2 ring-blue-200' : ''}
      ${isFocused ? 'ring-2 ring-blue-300' : ''}
      hover:bg-gray-50
    `}>
      <div className="p-3">
        {listItems.map((item, index) => (
          <div 
            key={item.id} 
            className="flex items-center space-x-3 mb-2 last:mb-0"
            style={{ paddingLeft: `${item.indentLevel * 20}px` }}
          >
            <div className="flex-shrink-0 w-4 flex justify-center">
              {getListIcon(index)}
            </div>
            <input
              ref={(el) => { itemRefs.current[index] = el; }}
              type="text"
              value={item.content}
              onChange={(e) => handleItemChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              placeholder="List item..."
              className={`
                flex-1 border-none bg-transparent text-gray-900 placeholder-gray-400 
                focus:outline-none text-base leading-relaxed
                ${block.type === 'checkList' && item.checked ? 'line-through text-gray-500' : ''}
              `}
            />
          </div>
        ))}
      </div>
      
      {/* Block actions - shown on hover */}
      <div className={`
        absolute left-0 top-3 -ml-8 flex opacity-0 transition-opacity
        ${(isSelected || isFocused) ? 'opacity-100' : 'group-hover:opacity-100'}
      `}>
        <div className="flex h-6 w-6 cursor-grab items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <circle cx="2" cy="2" r="1"/>
            <circle cx="6" cy="2" r="1"/>
            <circle cx="10" cy="2" r="1"/>
            <circle cx="2" cy="6" r="1"/>
            <circle cx="6" cy="6" r="1"/>
            <circle cx="10" cy="6" r="1"/>
            <circle cx="2" cy="10" r="1"/>
            <circle cx="6" cy="10" r="1"/>
            <circle cx="10" cy="10" r="1"/>
          </svg>
        </div>
      </div>
    </div>
  );
}