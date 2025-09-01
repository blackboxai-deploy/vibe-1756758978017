'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Block as BlockComponent } from './Block';
import { BlockMenu } from './BlockMenu';
import { useEditor } from '../../hooks/useEditor';
import { Block, BlockType } from '../../lib/types';

interface BlockEditorProps {
  initialBlocks: Block[];
  onChange?: (blocks: Block[]) => void;
  placeholder?: string;
  editable?: boolean;
}

export function BlockEditor({ 
  initialBlocks, 
  onChange, 
  placeholder = "Start writing...",
  editable = true 
}: BlockEditorProps) {
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [blockMenuPosition, setBlockMenuPosition] = useState({ top: 0, left: 0 });
  const [blockMenuIndex, setBlockMenuIndex] = useState(0);
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  
  const editorRef = useRef<HTMLDivElement>(null);
  const currentBlockRef = useRef<string | null>(null);

  const {
    blocks,
    editorState,
    addBlock,
    updateBlock,
    deleteBlock,
    convertBlock,
    selectBlock,
    clearSelection,
    handleKeyDown: editorHandleKeyDown,
    handleDragStart,
    handleDragEnd,
  } = useEditor(initialBlocks, onChange);

  // Handle slash command
  const handleSlashCommand = useCallback((blockId: string, position: { top: number; left: number }) => {
    const blockIndex = blocks.findIndex(b => b.id === blockId);
    setBlockMenuIndex(blockIndex);
    setBlockMenuPosition(position);
    setShowBlockMenu(true);
    setMenuSearchQuery('');
    currentBlockRef.current = blockId;
  }, [blocks]);

  // Handle block menu selection
  const handleBlockMenuSelect = useCallback((type: BlockType) => {
    if (currentBlockRef.current) {
      const currentBlock = blocks.find(b => b.id === currentBlockRef.current);
      if (currentBlock) {
        if (type === currentBlock.type) {
          // Same type selected, just close menu
          setShowBlockMenu(false);
          return;
        }

        if (currentBlock.content === '/' || currentBlock.content === '') {
          // Replace empty block or slash with new block type
          updateBlock(currentBlockRef.current, { 
            type, 
            content: '',
            properties: getDefaultProperties(type)
          });
        } else {
          // Convert existing block
          convertBlock(currentBlockRef.current, type);
        }
      }
    } else {
      // Add new block
      const newBlockId = addBlock(blockMenuIndex + 1, type);
      selectBlock(newBlockId);
    }
    
    setShowBlockMenu(false);
    currentBlockRef.current = null;
  }, [blocks, updateBlock, convertBlock, addBlock, selectBlock, blockMenuIndex]);

  // Get default properties for block types
  const getDefaultProperties = (type: BlockType) => {
    switch (type) {
      case 'heading1':
        return { level: 1 };
      case 'heading2':
        return { level: 2 };
      case 'heading3':
        return { level: 3 };
      case 'bulletList':
      case 'numberedList':
      case 'checkList':
        return { 
          listItems: [{ 
            id: `item_${Date.now()}`, 
            content: '', 
            indentLevel: 0,
            ...(type === 'checkList' ? { checked: false } : {})
          }] 
        };
      case 'callout':
        return { calloutType: 'info' };
      case 'code':
        return { language: 'javascript' };
      default:
        return {};
    }
  };

  // Handle block updates
  const handleBlockUpdate = useCallback((blockId: string, updates: Partial<Block>) => {
    updateBlock(blockId, updates);

    // Check for slash command
    if (updates.content === '/') {
      const blockElement = editorRef.current?.querySelector(`[data-block-id="${blockId}"]`);
      if (blockElement) {
        const rect = blockElement.getBoundingClientRect();
        const editorRect = editorRef.current!.getBoundingClientRect();
        handleSlashCommand(blockId, {
          top: rect.top - editorRect.top + rect.height,
          left: rect.left - editorRect.left,
        });
      }
    } else if (updates.content && updates.content !== '/' && showBlockMenu) {
      // Update search query if typing in block menu
      const query = updates.content.startsWith('/') ? updates.content.slice(1) : '';
      setMenuSearchQuery(query);
    }
  }, [updateBlock, handleSlashCommand, showBlockMenu]);

  // Handle Enter key on blocks
  const handleBlockEnter = useCallback((blockId: string) => {
    const blockIndex = blocks.findIndex(b => b.id === blockId);
    const newBlockId = addBlock(blockIndex + 1, 'paragraph');
    selectBlock(newBlockId);
  }, [blocks, addBlock, selectBlock]);

  // Handle Backspace key on blocks
  const handleBlockBackspace = useCallback((blockId: string) => {
    const blockIndex = blocks.findIndex(b => b.id === blockId);
    
    if (blockIndex === 0 && blocks.length === 1) {
      // Don't delete the last block, just convert to paragraph
      updateBlock(blockId, { type: 'paragraph', content: '', properties: {} });
      return;
    }

    deleteBlock(blockId);

    // Focus previous block
    const prevBlock = blocks[blockIndex - 1];
    if (prevBlock) {
      selectBlock(prevBlock.id);
    }
  }, [blocks, deleteBlock, updateBlock, selectBlock]);

  // Handle block focus
  const handleBlockFocus = useCallback((blockId: string) => {
    selectBlock(blockId);
  }, [selectBlock]);

  // Handle editor click
  const handleEditorClick = useCallback((e: React.MouseEvent) => {
    if (e.target === editorRef.current) {
      // Clicked on empty space, focus last block or add new one
      if (blocks.length > 0) {
        selectBlock(blocks[blocks.length - 1].id);
      } else {
        addBlock();
      }
    }
  }, [blocks, selectBlock, addBlock]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      editorHandleKeyDown(e, editorState.focusedBlock);
      
      // Close block menu on escape
      if (e.key === 'Escape' && showBlockMenu) {
        setShowBlockMenu(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editorHandleKeyDown, editorState.focusedBlock, showBlockMenu]);

  // Initialize with empty block if no blocks
  useEffect(() => {
    if (blocks.length === 0) {
      addBlock();
    }
  }, [blocks.length, addBlock]);

  if (!editable) {
    return (
      <div className="prose prose-gray max-w-none">
        {blocks.map((block) => (
          <BlockComponent
            key={block.id}
            block={block}
            isSelected={false}
            isFocused={false}
            onUpdate={() => {}}
            onFocus={() => {}}
            onBlur={() => {}}
            onEnterKey={() => {}}
            onBackspaceKey={() => {}}
          />
        ))}
      </div>
    );
  }

  return (
    <div 
      ref={editorRef}
      className="relative min-h-screen w-full p-8 focus:outline-none"
      onClick={handleEditorClick}
    >
      {/* Blocks */}
      <div className="space-y-2">
        {blocks.map((block) => (
          <div key={block.id} data-block-id={block.id}>
            <BlockComponent
              block={block}
              isSelected={editorState.selectedBlocks.includes(block.id)}
              isFocused={editorState.focusedBlock === block.id}
              onUpdate={(updates) => handleBlockUpdate(block.id, updates)}
              onFocus={() => handleBlockFocus(block.id)}
              onBlur={clearSelection}
              onEnterKey={() => handleBlockEnter(block.id)}
              onBackspaceKey={() => handleBlockBackspace(block.id)}
              onDragStart={() => handleDragStart(block.id)}
              onDragEnd={handleDragEnd}
            />
          </div>
        ))}
      </div>

      {/* Empty state */}
      {blocks.length === 0 && (
        <div className="flex items-center justify-center min-h-96 text-gray-400">
          <div className="text-center">
            <div className="text-xl mb-2">📝</div>
            <div>{placeholder}</div>
            <div className="text-sm mt-2">Type "/" to add blocks</div>
          </div>
        </div>
      )}

      {/* Block Menu */}
      {showBlockMenu && (
        <div
          className="absolute z-50"
          style={{
            top: blockMenuPosition.top,
            left: blockMenuPosition.left,
          }}
        >
          <BlockMenu
            isOpen={showBlockMenu}
            onClose={() => setShowBlockMenu(false)}
            onSelectBlock={handleBlockMenuSelect}
            searchQuery={menuSearchQuery}
          />
        </div>
      )}
    </div>
  );
}