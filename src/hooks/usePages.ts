'use client';

import { useState, useEffect, useCallback } from 'react';
import { Page, Workspace } from '../lib/types';
import { StorageService } from '../lib/storage';
import { createSampleWorkspace } from '../data/mock-data';
import { generatePageId, createEmptyBlock } from '../lib/editor-utils';

export function usePages() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize workspace
  useEffect(() => {
    let savedWorkspace = StorageService.loadWorkspace();
    
    if (!savedWorkspace) {
      savedWorkspace = createSampleWorkspace();
      StorageService.saveWorkspace(savedWorkspace);
    }
    
    setWorkspace(savedWorkspace);
    
    // Set initial page to first favorite or first page
    const initialPageId = savedWorkspace.favoritePages[0] || savedWorkspace.pages[0]?.id;
    if (initialPageId) {
      setCurrentPageId(initialPageId);
    }
    
    setLoading(false);
  }, []);

  // Save workspace whenever it changes
  useEffect(() => {
    if (workspace && !loading) {
      StorageService.saveWorkspace(workspace);
    }
  }, [workspace, loading]);

  const getCurrentPage = useCallback((): Page | null => {
    if (!workspace || !currentPageId) return null;
    return workspace.pages.find(page => page.id === currentPageId) || null;
  }, [workspace, currentPageId]);

  const getPageById = useCallback((pageId: string): Page | null => {
    if (!workspace) return null;
    return workspace.pages.find(page => page.id === pageId) || null;
  }, [workspace]);

  const createPage = useCallback((title: string = 'Untitled', parentId?: string, templateId?: string) => {
    if (!workspace) return;

    const pageId = generatePageId();
    let blocks = [createEmptyBlock('paragraph')];

    // Apply template if provided
    if (templateId) {
      const template = workspace.templates.find(t => t.id === templateId);
      if (template) {
        blocks = template.blocks.map(blockTemplate => ({
          ...blockTemplate,
          id: generatePageId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
      }
    }

    const newPage: Page = {
      id: pageId,
      title,
      blocks,
      parentId,
      properties: {
        icon: '📄',
        tags: [],
        isFavorite: false,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setWorkspace(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        pages: [...prev.pages, newPage],
        recentPages: [pageId, ...prev.recentPages.slice(0, 9)],
      };
    });

    setCurrentPageId(pageId);
    return pageId;
  }, [workspace]);

  const updatePage = useCallback((pageId: string, updates: Partial<Page>) => {
    if (!workspace) return;

    setWorkspace(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        pages: prev.pages.map(page =>
          page.id === pageId
            ? { ...page, ...updates, updatedAt: new Date() }
            : page
        ),
      };
    });

    // Add to recent pages
    StorageService.addToRecent(workspace.id, pageId);
  }, [workspace]);

  const deletePage = useCallback((pageId: string) => {
    if (!workspace) return;

    // Don't delete if it's the last page
    if (workspace.pages.length <= 1) return;

    setWorkspace(prev => {
      if (!prev) return prev;

      const filteredPages = prev.pages.filter(page => page.id !== pageId);
      
      return {
        ...prev,
        pages: filteredPages,
        recentPages: prev.recentPages.filter(id => id !== pageId),
        favoritePages: prev.favoritePages.filter(id => id !== pageId),
      };
    });

    // If deleted page was current page, switch to another
    if (currentPageId === pageId) {
      const remainingPages = workspace.pages.filter(page => page.id !== pageId);
      setCurrentPageId(remainingPages[0]?.id || null);
    }
  }, [workspace, currentPageId]);

  const duplicatePage = useCallback((pageId: string) => {
    if (!workspace) return;

    const originalPage = getPageById(pageId);
    if (!originalPage) return;

    const duplicatedPageId = generatePageId();
    const duplicatedPage: Page = {
      ...originalPage,
      id: duplicatedPageId,
      title: `${originalPage.title} (Copy)`,
      blocks: originalPage.blocks.map(block => ({
        ...block,
        id: generatePageId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setWorkspace(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        pages: [...prev.pages, duplicatedPage],
      };
    });

    return duplicatedPageId;
  }, [workspace, getPageById]);

  const toggleFavorite = useCallback((pageId: string) => {
    if (!workspace) return;

    setWorkspace(prev => {
      if (!prev) return prev;

      const isFavorite = prev.favoritePages.includes(pageId);
      const newFavoritePages = isFavorite
        ? prev.favoritePages.filter(id => id !== pageId)
        : [...prev.favoritePages, pageId];

      return {
        ...prev,
        favoritePages: newFavoritePages,
        pages: prev.pages.map(page =>
          page.id === pageId
            ? {
                ...page,
                properties: {
                  ...page.properties,
                  isFavorite: !isFavorite,
                },
                updatedAt: new Date(),
              }
            : page
        ),
      };
    });
  }, [workspace]);

  const movePage = useCallback((pageId: string, newParentId?: string) => {
    if (!workspace) return;

    setWorkspace(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        pages: prev.pages.map(page =>
          page.id === pageId
            ? { ...page, parentId: newParentId, updatedAt: new Date() }
            : page
        ),
      };
    });
  }, [workspace]);

  const getRecentPages = useCallback((): Page[] => {
    if (!workspace) return [];
    return workspace.recentPages
      .map(pageId => getPageById(pageId))
      .filter((page): page is Page => page !== null)
      .slice(0, 5);
  }, [workspace, getPageById]);

  const getFavoritePages = useCallback((): Page[] => {
    if (!workspace) return [];
    return workspace.favoritePages
      .map(pageId => getPageById(pageId))
      .filter((page): page is Page => page !== null);
  }, [workspace, getPageById]);

  const searchPages = useCallback((query: string): Page[] => {
    if (!workspace || !query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return workspace.pages.filter(page => 
      page.title.toLowerCase().includes(searchTerm) ||
      page.blocks.some(block => 
        block.content.toLowerCase().includes(searchTerm) ||
        (block.properties?.listItems?.some(item => 
          item.content.toLowerCase().includes(searchTerm)
        ))
      )
    );
  }, [workspace]);

  return {
    workspace,
    currentPageId,
    currentPage: getCurrentPage(),
    loading,
    setCurrentPageId,
    createPage,
    updatePage,
    deletePage,
    duplicatePage,
    toggleFavorite,
    movePage,
    getPageById,
    getRecentPages,
    getFavoritePages,
    searchPages,
  };
}