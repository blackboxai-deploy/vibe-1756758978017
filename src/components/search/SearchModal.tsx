'use client';

import { useState, useEffect, useRef } from 'react';
import { SearchResult } from '../../lib/types';
import { SearchResults } from './SearchResults';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchResults: SearchResult[];
  onSearch: (query: string) => void;
  onSelectResult: (result: SearchResult) => void;
  getHighlightedContent: (content: string, query: string) => { text: string; isMatch: boolean }[];
}

export function SearchModal({
  isOpen,
  onClose,
  searchResults,
  onSearch,
  onSelectResult,
  getHighlightedContent,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Update search results
  useEffect(() => {
    onSearch(query);
  }, [query, onSearch]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchResults]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev < searchResults.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          e.preventDefault();
          if (searchResults[selectedIndex]) {
            onSelectResult(searchResults[selectedIndex]);
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
  }, [isOpen, searchResults, selectedIndex, onSelectResult, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
        {/* Search input */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages and content..."
              className="w-full pl-10 pr-4 py-3 border-none text-lg placeholder-gray-400 focus:outline-none focus:ring-0"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Search results */}
        <div className="max-h-96 overflow-y-auto">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-gray-500">
              <div className="mb-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mx-auto text-gray-300">
                  <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                </svg>
              </div>
              <div className="text-lg font-medium text-gray-900 mb-2">Search your workspace</div>
              <div className="text-sm">Start typing to find pages and content</div>
              <div className="mt-4 text-xs text-gray-400">
                <div className="flex items-center justify-center space-x-4">
                  <span>↑↓ Navigate</span>
                  <span>Enter to select</span>
                  <span>Esc to close</span>
                </div>
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mb-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mx-auto text-gray-300">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </div>
              <div className="text-lg font-medium text-gray-900 mb-2">No results found</div>
              <div className="text-sm text-gray-500">
                Try searching for different keywords or check your spelling
              </div>
            </div>
          ) : (
            <SearchResults
              results={searchResults}
              selectedIndex={selectedIndex}
              onSelectResult={(result) => {
                onSelectResult(result);
                onClose();
              }}
              onHoverResult={(index) => setSelectedIndex(index)}
              getHighlightedContent={getHighlightedContent}
              searchQuery={query}
            />
          )}
        </div>

        {/* Footer */}
        {searchResults.length > 0 && (
          <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div>
                {searchResults.length} result{searchResults.length !== 1 ? 's' : '' as string}
              </div>
              <div className="flex items-center space-x-4">
                <span>↑↓ Navigate</span>
                <span>Enter to open</span>
                <span>Esc to close</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}