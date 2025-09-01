import { Workspace, Page } from './types';

const WORKSPACE_KEY = 'notion-app-workspace';
const SETTINGS_KEY = 'notion-app-settings';

export class StorageService {
  static saveWorkspace(workspace: Workspace): void {
    try {
      const serialized = JSON.stringify(workspace, (_, value) => {
        if (value instanceof Date) {
          return { _type: 'Date', value: value.toISOString() };
        }
        return value;
      });
      localStorage.setItem(WORKSPACE_KEY, serialized);
    } catch (error) {
      console.error('Failed to save workspace:', error);
    }
  }

  static loadWorkspace(): Workspace | null {
    try {
      const stored = localStorage.getItem(WORKSPACE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored, (_, value) => {
        if (value && typeof value === 'object' && value._type === 'Date') {
          return new Date(value.value);
        }
        return value;
      });

      return parsed as Workspace;
    } catch (error) {
      console.error('Failed to load workspace:', error);
      return null;
    }
  }

  static savePage(workspaceId: string, page: Page): void {
    const workspace = this.loadWorkspace();
    if (!workspace || workspace.id !== workspaceId) return;

    const pageIndex = workspace.pages.findIndex(p => p.id === page.id);
    if (pageIndex >= 0) {
      workspace.pages[pageIndex] = page;
    } else {
      workspace.pages.push(page);
    }

    this.saveWorkspace(workspace);
  }

  static deletePage(workspaceId: string, pageId: string): void {
    const workspace = this.loadWorkspace();
    if (!workspace || workspace.id !== workspaceId) return;

    // Remove from pages array
    workspace.pages = workspace.pages.filter(p => p.id !== pageId);
    
    // Remove from recent and favorites
    workspace.recentPages = workspace.recentPages.filter(id => id !== pageId);
    workspace.favoritePages = workspace.favoritePages.filter(id => id !== pageId);

    // Remove children references
    workspace.pages.forEach(page => {
      if (page.children) {
        page.children = page.children.filter(child => child.id !== pageId);
      }
    });

    this.saveWorkspace(workspace);
  }

  static addToRecent(workspaceId: string, pageId: string): void {
    const workspace = this.loadWorkspace();
    if (!workspace || workspace.id !== workspaceId) return;

    // Remove if already exists
    workspace.recentPages = workspace.recentPages.filter(id => id !== pageId);
    
    // Add to beginning
    workspace.recentPages.unshift(pageId);
    
    // Keep only last 10
    workspace.recentPages = workspace.recentPages.slice(0, 10);

    this.saveWorkspace(workspace);
  }

  static toggleFavorite(workspaceId: string, pageId: string): void {
    const workspace = this.loadWorkspace();
    if (!workspace || workspace.id !== workspaceId) return;

    const index = workspace.favoritePages.indexOf(pageId);
    if (index >= 0) {
      workspace.favoritePages.splice(index, 1);
    } else {
      workspace.favoritePages.push(pageId);
    }

    // Update page properties
    const page = workspace.pages.find(p => p.id === pageId);
    if (page) {
      page.properties.isFavorite = !page.properties.isFavorite;
    }

    this.saveWorkspace(workspace);
  }

  static exportWorkspace(): string {
    const workspace = this.loadWorkspace();
    return JSON.stringify(workspace, null, 2);
  }

  static importWorkspace(data: string): boolean {
    try {
      const workspace = JSON.parse(data) as Workspace;
      
      // Basic validation
      if (!workspace.id || !workspace.name || !Array.isArray(workspace.pages)) {
        throw new Error('Invalid workspace format');
      }

      this.saveWorkspace(workspace);
      return true;
    } catch (error) {
      console.error('Failed to import workspace:', error);
      return false;
    }
  }

  static clearWorkspace(): void {
    localStorage.removeItem(WORKSPACE_KEY);
  }

  static saveSettings(settings: any): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  static loadSettings(): any {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return null;
    }
  }
}