export interface Block {
  id: string;
  type: BlockType;
  content: string;
  properties?: BlockProperties;
  createdAt: Date;
  updatedAt: Date;
}

export type BlockType = 
  | 'paragraph'
  | 'heading1'
  | 'heading2' 
  | 'heading3'
  | 'bulletList'
  | 'numberedList'
  | 'checkList'
  | 'quote'
  | 'code'
  | 'callout'
  | 'image'
  | 'divider'
  | 'table'
  | 'toggle';

export interface BlockProperties {
  // For headings
  level?: 1 | 2 | 3;
  // For lists
  listItems?: ListItem[];
  // For callouts
  calloutType?: 'info' | 'warning' | 'error' | 'success';
  // For images
  imageUrl?: string;
  imageAlt?: string;
  // For tables
  tableData?: TableData;
  // For toggles
  isExpanded?: boolean;
  // For code blocks
  language?: string;
}

export interface ListItem {
  id: string;
  content: string;
  checked?: boolean;
  indentLevel: number;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface Page {
  id: string;
  title: string;
  blocks: Block[];
  parentId?: string;
  children?: Page[];
  properties: PageProperties;
  createdAt: Date;
  updatedAt: Date;
}

export interface PageProperties {
  icon?: string;
  coverImage?: string;
  tags?: string[];
  template?: string;
  isPublic?: boolean;
  isFavorite?: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  pages: Page[];
  recentPages: string[];
  favoritePages: string[];
  templates: Template[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  blocks: Omit<Block, 'id' | 'createdAt' | 'updatedAt'>[];
  properties: Partial<PageProperties>;
}

export type TemplateCategory = 
  | 'general'
  | 'meeting'
  | 'project'
  | 'personal'
  | 'knowledge';

export interface SearchResult {
  pageId: string;
  pageTitle: string;
  blockId?: string;
  blockContent?: string;
  matchType: 'title' | 'content';
  score: number;
}

export interface EditorState {
  selectedBlocks: string[];
  focusedBlock?: string;
  isEditMode: boolean;
  clipboard?: Block[];
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  autoSave: boolean;
  keyboardShortcuts: boolean;
}