'use client';

import { useState, useEffect, useRef } from 'react';
import { BlockType } from '../../lib/types';

interface BlockMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBlock: (type: BlockType) => void;
  searchQuery?: string;
}

interface BlockOption {
  type: BlockType;
  label: string;
  description: string;
  icon: string;
  keywords: string[];
}

const blockOptions: BlockOption[] = [
  {
    type: 'paragraph',
    label: 'Text',
    description: 'Just start writing with plain text',
    icon: '📝',
    keywords: ['text', 'paragraph', 'writing'],
  },
  {
    type: 'heading1',
    label: 'Heading 1',
    description: 'Big section heading',
    icon: '📋',
    keywords: ['heading', 'h1', 'title', 'big'],
  },
  {
    type: 'heading2',
    label: 'Heading 2',
    description: 'Medium section heading',
    icon: '📄',
    keywords: ['heading', 'h2', 'subtitle', 'medium'],
  },
  {
    type: 'heading3',
    label: 'Heading 3',
    description: 'Small section heading',
    icon: '📃',
    keywords: ['heading', 'h3', 'small'],
  },
  {
    type: 'bulletList',
    label: 'Bulleted list',
    description: 'Create a simple bulleted list',
    icon: '• ',
    keywords: ['list', 'bullet', 'unordered'],
  },
  {
    type: 'numberedList',
    label: 'Numbered list',
    description: 'Create a list with numbering',
    icon: '1.',
    keywords: ['list', 'numbered', 'ordered'],
  },
  {
    type: 'checkList',
    label: 'To-do list',
    description: 'Track tasks with a to-do list',
    icon: '☑️',
    keywords: ['todo', 'checklist', 'task', 'checkbox'],
  },
  {
    type: 'quote',
    label: 'Quote',
    description: 'Capture a quote',
    icon: '💬',
    keywords: ['quote', 'blockquote', 'citation'],
  },
  {
    type: 'code',
    label: 'Code',
    description: 'Capture a code snippet',
    icon: '💻',
    keywords: ['code', 'programming', 'snippet'],
  },
  {
    type: 'callout',
    label: 'Callout',
    description: 'Make writing stand out',
    icon: '📢',
    keywords: ['callout', 'highlight', 'notice', 'info'],
  },
  {
    type: 'image',
    label: 'Image',
    description: 'Upload or embed with a link',
    icon: '🖼️',
    keywords: ['image', 'picture', 'photo', 'media'],
  },
  {
    type: 'divider',
    label: 'Divider',
    description: 'Visually divide blocks',
    icon: '➖',
    keywords: ['divider', 'separator', 'line', 'break'],
  },
];

export function BlockMenu({ isOpen, onClose, onSelectBlock, searchQuery = '' }: BlockMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredOptions, setFilteredOptions] = useState(blockOptions);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOptions(blockOptions);
      setSelectedIndex(0);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = blockOptions.filter(option => 
      option.label.toLowerCase().includes(query) ||
      option.description.toLowerCase().includes(query) ||
      option.keywords.some(keyword => keyword.includes(query))
    );

    setFilteredOptions(filtered);
    setSelectedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredOptions.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredOptions.length) % filteredOptions.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredOptions[selectedIndex]) {
            onSelectBlock(filteredOptions[selectedIndex].type);
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
    return undefined;
  }, [isOpen, selectedIndex, filteredOptions, onSelectBlock, onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg"
    >
      <div className="max-h-96 overflow-y-auto py-2">
        {filteredOptions.length === 0 ? (
          <div className="px-4 py-3 text-sm text-gray-500">
            No blocks found for "{searchQuery}"
          </div>
        ) : (
          filteredOptions.map((option, index) => (
            <button
              key={option.type}
              className={`
                w-full px-4 py-3 text-left transition-colors
                ${index === selectedIndex ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50'}
              `}
              onClick={() => {
                onSelectBlock(option.type);
                onClose();
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 text-lg leading-none">
                  {option.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {option.description}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
      
      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-2">
        <div className="text-xs text-gray-500">
          Use ↑↓ to navigate • Enter to select • Esc to cancel
        </div>
      </div>
    </div>
  );
}