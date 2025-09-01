'use client';

import { useState, useRef, useEffect } from 'react';
import { Block } from '../../../lib/types';

interface TextBlockProps {
  block: Block;
  isSelected: boolean;
  isFocused: boolean;
  onUpdate: (updates: Partial<Block>) => void;
  onFocus: () => void;
  onBlur: () => void;
  onEnterKey: () => void;
  onBackspaceKey: () => void;
}

export function TextBlock({ 
  block, 
  isSelected, 
  isFocused, 
  onUpdate, 
  onFocus, 
  onBlur,
  onEnterKey,
  onBackspaceKey 
}: TextBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isFocused && textareaRef.current && !isEditing) {
      textareaRef.current.focus();
      setIsEditing(true);
    }
  }, [isFocused, isEditing]);

  const handleContentChange = (content: string) => {
    onUpdate({ content });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onEnterKey();
      setIsEditing(false);
    }
    
    if (e.key === 'Backspace' && block.content === '' && !e.shiftKey) {
      e.preventDefault();
      onBackspaceKey();
    }

    // Handle markdown shortcuts
    if (e.key === ' ') {
      const content = block.content;
      if (content === '#') {
        e.preventDefault();
        onUpdate({ type: 'heading1', content: '', properties: { level: 1 } });
      } else if (content === '##') {
        e.preventDefault();
        onUpdate({ type: 'heading2', content: '', properties: { level: 2 } });
      } else if (content === '###') {
        e.preventDefault();
        onUpdate({ type: 'heading3', content: '', properties: { level: 3 } });
      } else if (content === '-' || content === '*') {
        e.preventDefault();
        onUpdate({ 
          type: 'bulletList', 
          content: '', 
          properties: { 
            listItems: [{ id: `item_${Date.now()}`, content: '', indentLevel: 0 }] 
          } 
        });
      } else if (content === '1.') {
        e.preventDefault();
        onUpdate({ 
          type: 'numberedList', 
          content: '', 
          properties: { 
            listItems: [{ id: `item_${Date.now()}`, content: '', indentLevel: 0 }] 
          } 
        });
      } else if (content === '[]') {
        e.preventDefault();
        onUpdate({ 
          type: 'checkList', 
          content: '', 
          properties: { 
            listItems: [{ id: `item_${Date.now()}`, content: '', checked: false, indentLevel: 0 }] 
          } 
        });
      } else if (content === '>') {
        e.preventDefault();
        onUpdate({ type: 'quote', content: '' });
      } else if (content === '```') {
        e.preventDefault();
        onUpdate({ type: 'code', content: '', properties: { language: 'javascript' } });
      }
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
    onFocus();
  };

  const handleBlur = () => {
    setIsEditing(false);
    onBlur();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [block.content]);

  return (
    <div className={`
      group relative rounded-md transition-all duration-200
      ${isSelected ? 'bg-blue-50 ring-2 ring-blue-200' : ''}
      ${isFocused ? 'ring-2 ring-blue-300' : ''}
      hover:bg-gray-50
    `}>
      <textarea
        ref={textareaRef}
        value={block.content}
        onChange={(e) => handleContentChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={block.content === '' ? 'Type \'/\' for commands or start writing...' : ''}
        className="
          w-full resize-none border-none bg-transparent p-3 
          text-gray-900 placeholder-gray-400 focus:outline-none
          text-base leading-relaxed
        "
        rows={1}
        style={{ minHeight: '50px' }}
      />
      
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