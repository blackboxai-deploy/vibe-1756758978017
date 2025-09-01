'use client';

import { useState, useRef, useEffect } from 'react';
import { Block } from '../../../lib/types';

interface CalloutBlockProps {
  block: Block;
  isSelected: boolean;
  isFocused: boolean;
  onUpdate: (updates: Partial<Block>) => void;
  onFocus: () => void;
  onBlur: () => void;
  onEnterKey: () => void;
  onBackspaceKey: () => void;
}

export function CalloutBlock({ 
  block, 
  isSelected, 
  isFocused, 
  onUpdate, 
  onFocus, 
  onBlur,
  onEnterKey,
  onBackspaceKey 
}: CalloutBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const calloutType = block.properties?.calloutType || 'info';

  useEffect(() => {
    if (isFocused && textareaRef.current && !isEditing) {
      textareaRef.current.focus();
      setIsEditing(true);
    }
  }, [isFocused, isEditing]);

  const handleContentChange = (content: string) => {
    onUpdate({ content });
  };

  const handleTypeChange = (newType: 'info' | 'warning' | 'error' | 'success') => {
    onUpdate({
      properties: {
        ...block.properties,
        calloutType: newType,
      },
    });
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

  const getCalloutStyles = () => {
    switch (calloutType) {
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-600',
          text: 'text-blue-900',
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          icon: 'text-yellow-600',
          text: 'text-yellow-900',
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          icon: 'text-red-600',
          text: 'text-red-900',
        };
      case 'success':
        return {
          container: 'bg-green-50 border-green-200',
          icon: 'text-green-600',
          text: 'text-green-900',
        };
      default:
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-600',
          text: 'text-blue-900',
        };
    }
  };

  const getIcon = () => {
    switch (calloutType) {
      case 'info':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
          </svg>
        );
      case 'warning':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
          </svg>
        );
      case 'error':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4M15.5,14L16.92,15.42L15.5,16.84L14.08,15.42L12.66,16.84L11.24,15.42L12.66,14L11.24,12.58L12.66,11.16L14.08,12.58L15.5,11.16L16.92,12.58L15.5,14Z" />
          </svg>
        );
      case 'success':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const styles = getCalloutStyles();

  return (
    <div className={`
      group relative rounded-lg border transition-all duration-200
      ${isSelected ? 'ring-2 ring-blue-200' : ''}
      ${isFocused ? 'ring-2 ring-blue-300' : ''}
      hover:shadow-sm ${styles.container}
    `}>
      <div className="flex p-4">
        {/* Icon and type selector */}
        <div className="flex-shrink-0 mr-3">
          <div className={`${styles.icon} flex items-center justify-center`}>
            {getIcon()}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={block.content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Write a callout..."
            className={`
              w-full resize-none border-none bg-transparent 
              placeholder-gray-400 focus:outline-none
              text-base leading-relaxed font-medium ${styles.text}
            `}
            rows={1}
            style={{ minHeight: '24px' }}
          />
        </div>
        
        {/* Type selector */}
        {(isSelected || isFocused) && (
          <div className="flex-shrink-0 ml-2">
            <select
              value={calloutType}
              onChange={(e) => handleTypeChange(e.target.value as any)}
              className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-300"
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="success">Success</option>
            </select>
          </div>
        )}
      </div>
      
      {/* Block actions - shown on hover */}
      <div className={`
        absolute left-0 top-4 -ml-8 flex opacity-0 transition-opacity
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