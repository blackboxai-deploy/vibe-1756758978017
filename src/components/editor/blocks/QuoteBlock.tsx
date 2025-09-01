'use client';

import { useState, useRef, useEffect } from 'react';
import { Block } from '../../../lib/types';

interface QuoteBlockProps {
  block: Block;
  isSelected: boolean;
  isFocused: boolean;
  onUpdate: (updates: Partial<Block>) => void;
  onFocus: () => void;
  onBlur: () => void;
  onEnterKey: () => void;
  onBackspaceKey: () => void;
}

export function QuoteBlock({ 
  block, 
  isSelected, 
  isFocused, 
  onUpdate, 
  onFocus, 
  onBlur,
  onEnterKey,
  onBackspaceKey 
}: QuoteBlockProps) {
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
      <div className="flex p-3">
        {/* Quote indicator */}
        <div className="flex-shrink-0 w-1 bg-gray-300 rounded-full mr-4 my-1"></div>
        
        {/* Quote content */}
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={block.content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Quote..."
            className="
              w-full resize-none border-none bg-transparent 
              text-gray-700 placeholder-gray-400 focus:outline-none
              text-base leading-relaxed italic font-medium
            "
            rows={1}
            style={{ minHeight: '24px' }}
          />
        </div>
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

      {/* Quote icon */}
      <div className={`
        absolute right-2 top-2 opacity-0 transition-opacity
        ${(isSelected || isFocused) ? 'opacity-100' : 'group-hover:opacity-50'}
        text-gray-400
      `}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
        </svg>
      </div>
    </div>
  );
}