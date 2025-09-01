'use client';

import { useState, useRef, useEffect } from 'react';
import { Block } from '../../../lib/types';

interface HeadingBlockProps {
  block: Block;
  isSelected: boolean;
  isFocused: boolean;
  onUpdate: (updates: Partial<Block>) => void;
  onFocus: () => void;
  onBlur: () => void;
  onEnterKey: () => void;
  onBackspaceKey: () => void;
}

export function HeadingBlock({ 
  block, 
  isSelected, 
  isFocused, 
  onUpdate, 
  onFocus, 
  onBlur,
  onEnterKey,
  onBackspaceKey 
}: HeadingBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const level = block.properties?.level || 1;

  useEffect(() => {
    if (isFocused && inputRef.current && !isEditing) {
      inputRef.current.focus();
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
  };

  const handleFocus = () => {
    setIsEditing(true);
    onFocus();
  };

  const handleBlur = () => {
    setIsEditing(false);
    onBlur();
  };

  const getHeadingStyles = () => {
    switch (level) {
      case 1:
        return 'text-3xl font-bold text-gray-900';
      case 2:
        return 'text-2xl font-semibold text-gray-800';
      case 3:
        return 'text-xl font-medium text-gray-700';
      default:
        return 'text-xl font-medium text-gray-700';
    }
  };

  const getPlaceholder = () => {
    switch (level) {
      case 1:
        return 'Heading 1';
      case 2:
        return 'Heading 2';
      case 3:
        return 'Heading 3';
      default:
        return 'Heading';
    }
  };

  return (
    <div className={`
      group relative rounded-md transition-all duration-200
      ${isSelected ? 'bg-blue-50 ring-2 ring-blue-200' : ''}
      ${isFocused ? 'ring-2 ring-blue-300' : ''}
      hover:bg-gray-50
    `}>
      <input
        ref={inputRef}
        type="text"
        value={block.content}
        onChange={(e) => handleContentChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={getPlaceholder()}
        className={`
          w-full border-none bg-transparent p-3 placeholder-gray-400 focus:outline-none
          ${getHeadingStyles()}
        `}
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

      {/* Heading level indicator */}
      <div className={`
        absolute right-2 top-2 text-xs font-medium opacity-0 transition-opacity
        ${(isSelected || isFocused) ? 'opacity-100' : 'group-hover:opacity-50'}
        text-gray-500
      `}>
        H{level}
      </div>
    </div>
  );
}