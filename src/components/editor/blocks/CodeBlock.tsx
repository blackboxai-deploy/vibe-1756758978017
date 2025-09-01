'use client';

import { useState, useRef, useEffect } from 'react';
import { Block } from '../../../lib/types';

interface CodeBlockProps {
  block: Block;
  isSelected: boolean;
  isFocused: boolean;
  onUpdate: (updates: Partial<Block>) => void;
  onFocus: () => void;
  onBlur: () => void;
  onEnterKey: () => void;
  onBackspaceKey: () => void;
}

export function CodeBlock({ 
  block, 
  isSelected, 
  isFocused, 
  onUpdate, 
  onFocus, 
  onBlur,
  onEnterKey,
  onBackspaceKey 
}: CodeBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const language = block.properties?.language || 'javascript';

  useEffect(() => {
    if (isFocused && textareaRef.current && !isEditing) {
      textareaRef.current.focus();
      setIsEditing(true);
    }
  }, [isFocused, isEditing]);

  const handleContentChange = (content: string) => {
    onUpdate({ content });
  };

  const handleLanguageChange = (newLanguage: string) => {
    onUpdate({
      properties: {
        ...block.properties,
        language: newLanguage,
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onEnterKey();
      setIsEditing(false);
    }
    
    if (e.key === 'Backspace' && block.content === '' && !e.shiftKey && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onBackspaceKey();
    }
    
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      // Insert tab character
      const newContent = block.content.substring(0, start) + '  ' + block.content.substring(end);
      handleContentChange(newContent);
      
      // Move cursor
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(block.content);
  };

  const languageOptions = [
    'javascript',
    'typescript',
    'python',
    'java',
    'html',
    'css',
    'sql',
    'bash',
    'json',
    'xml',
    'markdown',
    'text',
  ];

  return (
    <div className={`
      group relative rounded-lg border transition-all duration-200
      ${isSelected ? 'bg-blue-50 ring-2 ring-blue-200 border-blue-200' : 'border-gray-200'}
      ${isFocused ? 'ring-2 ring-blue-300 border-blue-300' : ''}
      hover:border-gray-300 bg-gray-50
    `}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-100 rounded-t-lg">
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="text-sm text-gray-600 bg-transparent border-none focus:outline-none cursor-pointer"
        >
          {languageOptions.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        
        <button
          onClick={copyToClipboard}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          title="Copy code"
        >
          Copy
        </button>
      </div>
      
      {/* Code content */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={block.content}
          onChange={(e) => handleContentChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Enter your code..."
          className="
            w-full resize-none border-none bg-transparent p-4
            text-gray-900 placeholder-gray-400 focus:outline-none
            font-mono text-sm leading-relaxed
          "
          rows={3}
          style={{ minHeight: '120px' }}
          spellCheck={false}
        />
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

      {/* Help text */}
      {isEditing && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          Ctrl+Enter to exit
        </div>
      )}
    </div>
  );
}