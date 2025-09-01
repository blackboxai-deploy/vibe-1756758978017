'use client';

import { useState, useCallback, useMemo } from 'react';
import { Page, SearchResult } from '../lib/types';
import { searchInBlock } from '../lib/editor-utils';

export function useSearch(pages: Page[]) {
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchResults = useMemo((): SearchResult[] => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();

    pages.forEach(page => {
      // Search in page title
      if (page.title.toLowerCase().includes(searchTerm)) {
        results.push({
          pageId: page.id,
          pageTitle: page.title,
          matchType: 'title',
          score: page.title.toLowerCase().indexOf(searchTerm) === 0 ? 100 : 90,
        });
      }

      // Search in page content
      page.blocks.forEach(block => {
        if (searchInBlock(block, searchTerm)) {
          const content = block.content || block.properties?.listItems?.map(item => item.content).join(' ') || '';
          
          results.push({
            pageId: page.id,
            pageTitle: page.title,
            blockId: block.id,
            blockContent: content.substring(0, 150) + (content.length > 150 ? '...' : ''),
            matchType: 'content',
            score: calculateRelevanceScore(content, searchTerm),
          });
        }
      });
    });

    // Remove duplicates and sort by score
    const uniqueResults = removeDuplicateResults(results);
    return uniqueResults.sort((a, b) => b.score - a.score);
  }, [pages, query]);

  const calculateRelevanceScore = useCallback((content: string, searchTerm: string): number => {
    const lowerContent = content.toLowerCase();
    const lowerTerm = searchTerm.toLowerCase();
    
    let score = 0;
    
    // Exact phrase match gets highest score
    if (lowerContent.includes(lowerTerm)) {
      score += 50;
      
      // Bonus for exact match at beginning
      if (lowerContent.indexOf(lowerTerm) === 0) {
        score += 30;
      }
    }
    
    // Individual word matches
    const searchWords = lowerTerm.split(' ');
    const contentWords = lowerContent.split(' ');
    
    searchWords.forEach(word => {
      contentWords.forEach(contentWord => {
        if (contentWord.includes(word)) {
          score += 10;
          
          // Bonus for exact word match
          if (contentWord === word) {
            score += 10;
          }
        }
      });
    });
    
    return Math.min(score, 100); // Cap at 100
  }, []);

  const removeDuplicateResults = useCallback((results: SearchResult[]): SearchResult[] => {
    const seen = new Set<string>();
    return results.filter(result => {
      const key = `${result.pageId}-${result.blockId || 'title'}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }, []);

  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setQuery('');
  }, []);

  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  // Get recent searches (could be enhanced with localStorage)
  const getRecentSearches = useCallback((): string[] => {
    // For now, return empty array - could be enhanced with localStorage
    return [];
  }, []);

  // Get search suggestions based on page titles and common terms
  const getSearchSuggestions = useCallback((partialQuery: string): string[] => {
    if (!partialQuery.trim()) return [];
    
    const suggestions = new Set<string>();
    const searchTerm = partialQuery.toLowerCase();
    
    // Suggest page titles
    pages.forEach(page => {
      if (page.title.toLowerCase().includes(searchTerm)) {
        suggestions.add(page.title);
      }
      
      // Suggest tags
      page.properties.tags?.forEach(tag => {
        if (tag.toLowerCase().includes(searchTerm)) {
          suggestions.add(tag);
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 5);
  }, [pages]);

  // Advanced search filters
  const searchWithFilters = useCallback((
    searchQuery: string,
    filters: {
      tags?: string[];
      dateRange?: { start?: Date; end?: Date };
      pageTypes?: string[];
      favorites?: boolean;
    } = {}
  ): SearchResult[] => {
    let filteredPages = [...pages];
    
    // Filter by favorites
    if (filters.favorites) {
      filteredPages = filteredPages.filter(page => page.properties.isFavorite);
    }
    
    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      filteredPages = filteredPages.filter(page =>
        page.properties.tags?.some(tag => filters.tags!.includes(tag))
      );
    }
    
    // Filter by date range
    if (filters.dateRange?.start || filters.dateRange?.end) {
      filteredPages = filteredPages.filter(page => {
        const pageDate = page.createdAt;
        if (filters.dateRange!.start && pageDate < filters.dateRange!.start) return false;
        if (filters.dateRange!.end && pageDate > filters.dateRange!.end) return false;
        return true;
      });
    }
    
    // Perform search on filtered pages
    const results: SearchResult[] = [];
    const searchTerm = searchQuery.toLowerCase();
    
    filteredPages.forEach(page => {
      if (page.title.toLowerCase().includes(searchTerm)) {
        results.push({
          pageId: page.id,
          pageTitle: page.title,
          matchType: 'title',
          score: calculateRelevanceScore(page.title, searchTerm),
        });
      }
      
      page.blocks.forEach(block => {
        if (searchInBlock(block, searchTerm)) {
          const content = block.content || '';
          results.push({
            pageId: page.id,
            pageTitle: page.title,
            blockId: block.id,
            blockContent: content.substring(0, 150) + (content.length > 150 ? '...' : ''),
            matchType: 'content',
            score: calculateRelevanceScore(content, searchTerm),
          });
        }
      });
    });
    
    return results.sort((a, b) => b.score - a.score);
  }, [pages, calculateRelevanceScore]);

  // Keyboard shortcut handling
  const handleSearchKeydown = useCallback((event: KeyboardEvent) => {
    // Ctrl+/ or Cmd+/ to open search
    if ((event.ctrlKey || event.metaKey) && event.key === '/') {
      event.preventDefault();
      openSearch();
    }
    
    // Escape to close search
    if (event.key === 'Escape' && isSearchOpen) {
      closeSearch();
    }
  }, [isSearchOpen, openSearch, closeSearch]);

  // Get highlighted content for search results
  const getHighlightedContent = useCallback((content: string, searchTerm: string): { text: string; isMatch: boolean }[] => {
    if (!searchTerm.trim()) {
      return [{ text: content, isMatch: false }];
    }
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = content.split(regex);
    
    return parts.map((part, index) => ({
      text: part,
      isMatch: index % 2 === 1, // Every other part is a match
    }));
  }, []);

  return {
    query,
    searchResults,
    isSearchOpen,
    search,
    clearSearch,
    openSearch,
    closeSearch,
    getRecentSearches,
    getSearchSuggestions,
    searchWithFilters,
    handleSearchKeydown,
    getHighlightedContent,
  };
}