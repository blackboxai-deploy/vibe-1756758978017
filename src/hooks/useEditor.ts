'use client';

import { useState, useCallback, useRef } from 'react';
import { Block, EditorState } from '../lib/types';
import { generateBlockId, createEmptyBlock, duplicateBlock, convertBlockType } from '../lib/editor-utils';

export function useEditor(initialBlocks: Block[] = [], onBlocksChange?: (blocks: Block[]) => void) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [editorState, setEditorState] = useState<EditorState>({
    selectedBlocks: [],
    isEditMode: false,
    clipboard: [],
  });
  
  const draggedBlockRef = useRef<string | null>(null);

  // Update blocks and notify parent
  const updateBlocks = useCallback((newBlocks: Block[]) => {
    setBlocks(newBlocks);
    onBlocksChange?.(newBlocks);
  }, [onBlocksChange]);

  // Block management
  const addBlock = useCallback((index: number = blocks.length, blockType: Block['type'] = 'paragraph') => {
    const newBlock = createEmptyBlock(blockType);
    const newBlocks = [...blocks];
    newBlocks.splice(index, 0, newBlock);
    updateBlocks(newBlocks);
    
    // Focus the new block
    setEditorState(prev => ({
      ...prev,
      focusedBlock: newBlock.id,
      selectedBlocks: [newBlock.id],
    }));
    
    return newBlock.id;
  }, [blocks, updateBlocks]);

  const updateBlock = useCallback((blockId: string, updates: Partial<Block>) => {
    const newBlocks = blocks.map(block =>
      block.id === blockId
        ? { ...block, ...updates, updatedAt: new Date() }
        : block
    );
    updateBlocks(newBlocks);
  }, [blocks, updateBlocks]);

  const deleteBlock = useCallback((blockId: string) => {
    if (blocks.length <= 1) return; // Don't delete the last block
    
    const blockIndex = blocks.findIndex(block => block.id === blockId);
    if (blockIndex === -1) return;

    const newBlocks = blocks.filter(block => block.id !== blockId);
    updateBlocks(newBlocks);

    // Focus previous block or next block
    const focusBlockIndex = Math.max(0, blockIndex - 1);
    const focusBlock = newBlocks[focusBlockIndex];
    if (focusBlock) {
      setEditorState(prev => ({
        ...prev,
        focusedBlock: focusBlock.id,
        selectedBlocks: [focusBlock.id],
      }));
    }
  }, [blocks, updateBlocks]);

  const duplicateBlockHandler = useCallback((blockId: string) => {
    const blockIndex = blocks.findIndex(block => block.id === blockId);
    if (blockIndex === -1) return;

    const originalBlock = blocks[blockIndex];
    const duplicatedBlock = duplicateBlock(originalBlock);
    
    const newBlocks = [...blocks];
    newBlocks.splice(blockIndex + 1, 0, duplicatedBlock);
    updateBlocks(newBlocks);

    // Focus the duplicated block
    setEditorState(prev => ({
      ...prev,
      focusedBlock: duplicatedBlock.id,
      selectedBlocks: [duplicatedBlock.id],
    }));
  }, [blocks, updateBlocks]);

  const convertBlock = useCallback((blockId: string, newType: Block['type']) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    const convertedBlock = convertBlockType(block, newType);
    updateBlock(blockId, convertedBlock);
  }, [blocks, updateBlock]);

  // Block reordering
  const moveBlock = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    updateBlocks(newBlocks);
  }, [blocks, updateBlocks]);

  const moveBlockById = useCallback((blockId: string, newIndex: number) => {
    const currentIndex = blocks.findIndex(block => block.id === blockId);
    if (currentIndex === -1) return;
    
    moveBlock(currentIndex, newIndex);
  }, [blocks, moveBlock]);

  // Selection management
  const selectBlock = useCallback((blockId: string, multiSelect: boolean = false) => {
    setEditorState(prev => {
      if (multiSelect) {
        const isSelected = prev.selectedBlocks.includes(blockId);
        const newSelected = isSelected
          ? prev.selectedBlocks.filter(id => id !== blockId)
          : [...prev.selectedBlocks, blockId];
        return {
          ...prev,
          selectedBlocks: newSelected,
          focusedBlock: blockId,
        };
      } else {
        return {
          ...prev,
          selectedBlocks: [blockId],
          focusedBlock: blockId,
        };
      }
    });
  }, []);

  const clearSelection = useCallback(() => {
    setEditorState(prev => ({
      ...prev,
      selectedBlocks: [],
      focusedBlock: undefined,
    }));
  }, []);

  // Clipboard operations
  const copyBlocks = useCallback((blockIds: string[]) => {
    const blocksToCopy = blocks.filter(block => blockIds.includes(block.id));
    setEditorState(prev => ({
      ...prev,
      clipboard: blocksToCopy,
    }));
  }, [blocks]);

  const cutBlocks = useCallback((blockIds: string[]) => {
    copyBlocks(blockIds);
    
    // Delete the blocks
    const newBlocks = blocks.filter(block => !blockIds.includes(block.id));
    if (newBlocks.length === 0) {
      // Always keep at least one block
      newBlocks.push(createEmptyBlock());
    }
    updateBlocks(newBlocks);
    clearSelection();
  }, [blocks, copyBlocks, updateBlocks, clearSelection]);

  const pasteBlocks = useCallback((atIndex: number = blocks.length) => {
    if (editorState.clipboard.length === 0) return;

    const newBlocks = editorState.clipboard.map(block => ({
      ...block,
      id: generateBlockId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const updatedBlocks = [...blocks];
    updatedBlocks.splice(atIndex, 0, ...newBlocks);
    updateBlocks(updatedBlocks);

    // Select the pasted blocks
    const pastedIds = newBlocks.map(block => block.id);
    setEditorState(prev => ({
      ...prev,
      selectedBlocks: pastedIds,
      focusedBlock: pastedIds[0],
    }));
  }, [blocks, editorState.clipboard, updateBlocks]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((event: KeyboardEvent, blockId?: string) => {
    const isCtrlOrCmd = event.ctrlKey || event.metaKey;

    if (isCtrlOrCmd) {
      switch (event.key) {
        case 'c':
          if (editorState.selectedBlocks.length > 0) {
            event.preventDefault();
            copyBlocks(editorState.selectedBlocks);
          }
          break;
        case 'x':
          if (editorState.selectedBlocks.length > 0) {
            event.preventDefault();
            cutBlocks(editorState.selectedBlocks);
          }
          break;
        case 'v':
          event.preventDefault();
          const blockIndex = blockId ? blocks.findIndex(b => b.id === blockId) + 1 : blocks.length;
          pasteBlocks(blockIndex);
          break;
        case 'd':
          if (blockId) {
            event.preventDefault();
            duplicateBlockHandler(blockId);
          }
          break;
        case 'Enter':
          if (blockId) {
            event.preventDefault();
            const blockIndex = blocks.findIndex(b => b.id === blockId);
            addBlock(blockIndex + 1);
          }
          break;
      }
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (editorState.selectedBlocks.length > 0 && !editorState.isEditMode) {
        event.preventDefault();
        editorState.selectedBlocks.forEach(blockId => deleteBlock(blockId));
      }
    }
  }, [editorState, blocks, copyBlocks, cutBlocks, pasteBlocks, duplicateBlockHandler, addBlock, deleteBlock]);

  // Drag and drop
  const handleDragStart = useCallback((blockId: string) => {
    draggedBlockRef.current = blockId;
  }, []);

  const handleDragEnd = useCallback(() => {
    draggedBlockRef.current = null;
  }, []);

  const handleDrop = useCallback((targetIndex: number) => {
    if (!draggedBlockRef.current) return;

    const sourceIndex = blocks.findIndex(block => block.id === draggedBlockRef.current);
    if (sourceIndex === -1) return;

    moveBlock(sourceIndex, targetIndex);
    draggedBlockRef.current = null;
  }, [blocks, moveBlock]);

  // Initialize blocks if empty
  if (blocks.length === 0 && initialBlocks.length > 0) {
    setBlocks(initialBlocks);
  }

  return {
    blocks,
    editorState,
    addBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock: duplicateBlockHandler,
    convertBlock,
    moveBlock,
    moveBlockById,
    selectBlock,
    clearSelection,
    copyBlocks,
    cutBlocks,
    pasteBlocks,
    handleKeyDown,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    setBlocks: updateBlocks,
    setEditorState,
  };
}