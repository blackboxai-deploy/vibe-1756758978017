'use client';

import { Block as BlockType } from '../../lib/types';
import { TextBlock } from './blocks/TextBlock';
import { HeadingBlock } from './blocks/HeadingBlock';
import { ListBlock } from './blocks/ListBlock';
import { QuoteBlock } from './blocks/QuoteBlock';
import { CodeBlock } from './blocks/CodeBlock';
import { CalloutBlock } from './blocks/CalloutBlock';
import { ImageBlock } from './blocks/ImageBlock';

interface BlockProps {
  block: BlockType;
  isSelected: boolean;
  isFocused: boolean;
  onUpdate: (updates: Partial<BlockType>) => void;
  onFocus: () => void;
  onBlur: () => void;
  onEnterKey: () => void;
  onBackspaceKey: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export function Block({
  block,
  isSelected,
  isFocused,
  onUpdate,
  onFocus,
  onBlur,
  onEnterKey,
  onBackspaceKey,
  onDragStart,
  onDragEnd,
}: BlockProps) {
  const blockProps = {
    block,
    isSelected,
    isFocused,
    onUpdate,
    onFocus,
    onBlur,
    onEnterKey,
    onBackspaceKey,
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only trigger drag on the drag handle, not the whole block
    if (e.target instanceof Element && e.target.closest('[data-drag-handle]')) {
      onDragStart?.();
    }
  };

  const renderBlock = () => {
    switch (block.type) {
      case 'paragraph':
        return <TextBlock {...blockProps} />;
      
      case 'heading1':
      case 'heading2':
      case 'heading3':
        return <HeadingBlock {...blockProps} />;
      
      case 'bulletList':
      case 'numberedList':
      case 'checkList':
        return <ListBlock {...blockProps} />;
      
      case 'quote':
        return <QuoteBlock {...blockProps} />;
      
      case 'code':
        return <CodeBlock {...blockProps} />;
      
      case 'callout':
        return <CalloutBlock {...blockProps} />;
      
      case 'image':
        return <ImageBlock {...blockProps} />;
      
      case 'divider':
        return <DividerBlock {...blockProps} />;
      
      default:
        return <TextBlock {...blockProps} />;
    }
  };

  return (
    <div
      className="relative mb-2 last:mb-0"
      onMouseDown={handleMouseDown}
      onMouseUp={onDragEnd}
    >
      {renderBlock()}
    </div>
  );
}

// Simple divider block component
function DividerBlock({ isSelected, isFocused, onFocus, onBlur, onEnterKey, onBackspaceKey }: {
  isSelected: boolean;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onEnterKey: () => void;
  onBackspaceKey: () => void;
}) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEnterKey();
    }
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      onBackspaceKey();
    }
  };

  return (
    <div
      className={`
        group relative py-4 transition-all duration-200
        ${isSelected ? 'bg-blue-50 ring-2 ring-blue-200 rounded-md' : ''}
        ${isFocused ? 'ring-2 ring-blue-300 rounded-md' : ''}
        hover:bg-gray-50 rounded-md
      `}
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
    >
      <div className="h-px bg-gray-300 mx-4"></div>
      
      {/* Block actions - shown on hover */}
      <div className={`
        absolute left-0 top-4 -ml-8 flex opacity-0 transition-opacity
        ${(isSelected || isFocused) ? 'opacity-100' : 'group-hover:opacity-100'}
      `}>
        <div className="flex h-6 w-6 cursor-grab items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600" data-drag-handle>
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