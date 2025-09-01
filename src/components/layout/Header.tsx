'use client';

import { useState } from 'react';
import { Page } from '../../lib/types';

interface HeaderProps {
  currentPage: Page | null;
  onUpdatePage?: (updates: Partial<Page>) => void;
  onSearch: () => void;
  onToggleSidebar?: () => void;
}

export function Header({ 
  currentPage, 
  onUpdatePage, 
  onSearch, 
  onToggleSidebar
}: HeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [showPageMenu, setShowPageMenu] = useState(false);

  const handleTitleEdit = () => {
    if (!currentPage || !onUpdatePage) return;
    setTempTitle(currentPage.title);
    setIsEditingTitle(true);
  };

  const handleTitleSave = () => {
    if (!currentPage || !onUpdatePage) return;
    onUpdatePage({ title: tempTitle || 'Untitled' });
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setIsEditingTitle(false);
    setTempTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      handleTitleCancel();
    }
  };

  const getBreadcrumb = () => {
    if (!currentPage) return [];
    
    const breadcrumb: Page[] = [];
    let page = currentPage;
    
    // Note: In a real implementation, you'd need access to the full page tree
    // to build the proper breadcrumb. For now, just show the current page.
    breadcrumb.unshift(page);
    
    return breadcrumb;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      {/* Left section */}
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        {/* Sidebar toggle (mobile) */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
            </svg>
          </button>
        )}

        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 min-w-0">
          {getBreadcrumb().map((page, index) => (
            <div key={page.id} className="flex items-center space-x-2">
              {index > 0 && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                  <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                </svg>
              )}
              <div className="flex items-center space-x-2 min-w-0">
                <span className="text-lg">{page.properties.icon || '📄'}</span>
                {isEditingTitle && index === getBreadcrumb().length - 1 ? (
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onBlur={handleTitleSave}
                    onKeyDown={handleKeyDown}
                    className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 min-w-0 flex-1"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={index === getBreadcrumb().length - 1 ? handleTitleEdit : undefined}
                    className={`
                      text-lg font-semibold truncate text-left
                      ${index === getBreadcrumb().length - 1 
                        ? 'text-gray-900 hover:bg-gray-100 rounded px-1 transition-colors' 
                        : 'text-gray-500'
                      }
                    `}
                    disabled={!onUpdatePage}
                  >
                    {page.title || 'Untitled'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-3">
        {/* Page metadata */}
        {currentPage && (
          <div className="hidden md:block text-sm text-gray-500">
            Last edited {formatDate(currentPage.updatedAt)}
          </div>
        )}

        {/* Search button */}
        <button
          onClick={onSearch}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          title="Search (Ctrl+/)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
          </svg>
        </button>

        {/* Page menu */}
        <div className="relative">
          <button
            onClick={() => setShowPageMenu(!showPageMenu)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            title="Page options"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
            </svg>
          </button>

          {/* Page menu dropdown */}
          {showPageMenu && currentPage && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button
                onClick={() => {
                  onUpdatePage?.({ 
                    properties: { 
                      ...currentPage.properties, 
                      isFavorite: !currentPage.properties.isFavorite 
                    } 
                  });
                  setShowPageMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                disabled={!onUpdatePage}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-3">
                  <path d={currentPage.properties.isFavorite 
                    ? "M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                    : "M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z"
                  } />
                </svg>
                {currentPage.properties.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              </button>
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setShowPageMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-3">
                  <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z" />
                </svg>
                Copy link
              </button>

              <hr className="my-1" />
              
              <button
                onClick={() => {
                  // TODO: Implement export functionality
                  setShowPageMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-3">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                Export page
              </button>
            </div>
          )}
        </div>

        {/* Click outside to close menu */}
        {showPageMenu && (
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowPageMenu(false)}
          />
        )}
      </div>
    </header>
  );
}