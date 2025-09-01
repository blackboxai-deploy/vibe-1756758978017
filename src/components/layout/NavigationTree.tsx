'use client';

import { useState } from 'react';
import { Page } from '../../lib/types';

interface NavigationTreeProps {
  pages: Page[];
  allPages: Page[];
  currentPageId: string | null;
  onPageSelect: (pageId: string) => void;
  onDeletePage: (pageId: string) => void;
  onToggleFavorite: (pageId: string) => void;
  showFavorites?: boolean;
  level?: number;
}

export function NavigationTree({
  pages,
  allPages,
  currentPageId,
  onPageSelect,
  onDeletePage,
  onToggleFavorite,
  showFavorites = true,
  level = 0,
}: NavigationTreeProps) {
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [hoveredPage, setHoveredPage] = useState<string | null>(null);

  const toggleExpanded = (pageId: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId);
    } else {
      newExpanded.add(pageId);
    }
    setExpandedPages(newExpanded);
  };

  const getChildPages = (pageId: string): Page[] => {
    return allPages.filter(page => page.parentId === pageId);
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const PageItem = ({ page }: { page: Page }) => {
    const childPages = getChildPages(page.id);
    const hasChildren = childPages.length > 0;
    const isExpanded = expandedPages.has(page.id);
    const isCurrentPage = currentPageId === page.id;
    const isHovered = hoveredPage === page.id;

    return (
      <div>
        <div
          className={`
            group flex items-center px-2 py-1.5 rounded-md cursor-pointer transition-colors
            ${isCurrentPage 
              ? 'bg-blue-100 text-blue-900' 
              : 'hover:bg-gray-100 text-gray-700'
            }
          `}
          style={{ paddingLeft: `${8 + level * 16}px` }}
          onClick={() => onPageSelect(page.id)}
          onMouseEnter={() => setHoveredPage(page.id)}
          onMouseLeave={() => setHoveredPage(null)}
        >
          {/* Expand/collapse button */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(page.id);
              }}
              className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 mr-1"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              >
                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
              </svg>
            </button>
          )}
          
          {/* Page icon */}
          <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center mr-2 text-sm">
            {page.properties.icon || '📄'}
          </div>
          
          {/* Page title */}
          <div className="flex-1 truncate text-sm font-medium">
            {page.title || 'Untitled'}
          </div>
          
          {/* Actions */}
          <div className={`
            flex items-center space-x-1 ml-2 opacity-0 transition-opacity
            ${(isHovered || isCurrentPage) ? 'opacity-100' : 'group-hover:opacity-100'}
          `}>
            {/* Favorite button */}
            {showFavorites && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(page.id);
                }}
                className={`
                  w-5 h-5 flex items-center justify-center rounded text-xs transition-colors
                  ${page.properties.isFavorite
                    ? 'text-yellow-600 hover:text-yellow-700'
                    : 'text-gray-400 hover:text-gray-600'
                  }
                `}
                title={page.properties.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d={page.properties.isFavorite 
                    ? "M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                    : "M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z"
                  } />
                </svg>
              </button>
            )}
            
            {/* More options */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Implement context menu
              }}
              className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 transition-colors"
              title="More options"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Metadata */}
        {(isHovered || isCurrentPage) && (
          <div 
            className="text-xs text-gray-400 mt-1 mb-2"
            style={{ paddingLeft: `${24 + level * 16}px` }}
          >
            <div className="flex items-center space-x-3">
              <span>Updated {formatDate(page.updatedAt)}</span>
              {page.blocks.length > 0 && (
                <span>{page.blocks.length} blocks</span>
              )}
              {page.properties.tags && page.properties.tags.length > 0 && (
                <div className="flex items-center space-x-1">
                  <span>Tags:</span>
                  <div className="flex space-x-1">
                    {page.properties.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-1 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {page.properties.tags.length > 3 && (
                      <span className="text-gray-500">+{page.properties.tags.length - 3}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Child pages */}
        {hasChildren && isExpanded && (
          <div className="ml-2">
            <NavigationTree
              pages={childPages}
              allPages={allPages}
              currentPageId={currentPageId}
              onPageSelect={onPageSelect}
              onDeletePage={onDeletePage}
              onToggleFavorite={onToggleFavorite}
              showFavorites={showFavorites}
              level={level + 1}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {pages.map((page) => (
        <div key={page.id}>
          <PageItem page={page} />
        </div>
      ))}
    </div>
  );
}