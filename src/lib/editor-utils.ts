import { Block, BlockType, ListItem } from './types';

export function generateBlockId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generatePageId(): string {
  return `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createEmptyBlock(type: BlockType = 'paragraph'): Block {
  const now = new Date();
  return {
    id: generateBlockId(),
    type,
    content: '',
    properties: {},
    createdAt: now,
    updatedAt: now,
  };
}

export function createHeadingBlock(level: 1 | 2 | 3, content: string = ''): Block {
  return {
    ...createEmptyBlock(`heading${level}` as BlockType),
    content,
    properties: { level },
  };
}

export function createListBlock(type: 'bulletList' | 'numberedList' | 'checkList', items: string[] = ['']): Block {
  const listItems: ListItem[] = items.map((content, index) => ({
    id: `item_${Date.now()}_${index}`,
    content,
    checked: type === 'checkList' ? false : undefined,
    indentLevel: 0,
  }));

  return {
    ...createEmptyBlock(type),
    content: '',
    properties: { listItems },
  };
}

export function createCalloutBlock(content: string = '', calloutType: 'info' | 'warning' | 'error' | 'success' = 'info'): Block {
  return {
    ...createEmptyBlock('callout'),
    content,
    properties: { calloutType },
  };
}

export function createCodeBlock(content: string = '', language: string = 'javascript'): Block {
  return {
    ...createEmptyBlock('code'),
    content,
    properties: { language },
  };
}

export function createImageBlock(imageUrl: string, imageAlt: string = ''): Block {
  return {
    ...createEmptyBlock('image'),
    content: '',
    properties: { imageUrl, imageAlt },
  };
}

export function duplicateBlock(block: Block): Block {
  return {
    ...block,
    id: generateBlockId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function canConvertBlockType(fromType: BlockType, toType: BlockType): boolean {
  // Text-based blocks can be converted between each other
  const textBlocks: BlockType[] = ['paragraph', 'heading1', 'heading2', 'heading3', 'quote'];
  const listBlocks: BlockType[] = ['bulletList', 'numberedList', 'checkList'];
  
  if (textBlocks.includes(fromType) && textBlocks.includes(toType)) {
    return true;
  }
  
  if (listBlocks.includes(fromType) && listBlocks.includes(toType)) {
    return true;
  }
  
  // Special conversions
  if (fromType === 'paragraph' && toType === 'code') return true;
  if (fromType === 'code' && toType === 'paragraph') return true;
  
  return false;
}

export function convertBlockType(block: Block, newType: BlockType): Block {
  if (!canConvertBlockType(block.type, newType)) {
    return block;
  }

  const convertedBlock: Block = {
    ...block,
    type: newType,
    updatedAt: new Date(),
    properties: {},
  };

  // Handle specific conversions
  if (newType.startsWith('heading')) {
    const level = parseInt(newType.replace('heading', '')) as 1 | 2 | 3;
    convertedBlock.properties = { level };
  } else if (newType === 'bulletList' || newType === 'numberedList' || newType === 'checkList') {
    const listItems: ListItem[] = [{
      id: `item_${Date.now()}_0`,
      content: block.content,
      checked: newType === 'checkList' ? false : undefined,
      indentLevel: 0,
    }];
    convertedBlock.properties = { listItems };
    convertedBlock.content = '';
  } else if (block.type === 'bulletList' || block.type === 'numberedList' || block.type === 'checkList') {
    // Convert from list to text-based
    const firstItem = block.properties?.listItems?.[0];
    convertedBlock.content = firstItem?.content || '';
  }

  return convertedBlock;
}

export function getBlockDisplayContent(block: Block): string {
  switch (block.type) {
    case 'bulletList':
    case 'numberedList':
    case 'checkList':
      return block.properties?.listItems?.map(item => item.content).join(', ') || '';
    case 'image':
      return block.properties?.imageAlt || 'Image';
    case 'divider':
      return '---';
    default:
      return block.content;
  }
}

export function searchInBlock(block: Block, query: string): boolean {
  const searchText = query.toLowerCase();
  
  // Search in main content
  if (block.content.toLowerCase().includes(searchText)) {
    return true;
  }
  
  // Search in list items
  if (block.properties?.listItems) {
    return block.properties.listItems.some(item => 
      item.content.toLowerCase().includes(searchText)
    );
  }
  
  // Search in image alt text
  if (block.properties?.imageAlt?.toLowerCase().includes(searchText)) {
    return true;
  }
  
  return false;
}