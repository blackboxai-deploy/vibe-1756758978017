'use client';

import { useState } from 'react';
import { Page, Workspace } from '../../lib/types';
import { NavigationTree } from './NavigationTree';

interface SidebarProps {
  workspace: Workspace;
  currentPageId: string | null;
  onPageSelect: (pageId: string) => void;
  onNewPage: (templateId?: string) => void;
  onDeletePage: (pageId: string) => void;
  onToggleFavorite: (pageId: string) => void;
  onSearch: () => void;
  recentPages: Page[];
  favoritePages: Page[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  workspace,
  currentPageId,
  onPageSelect,
  onNewPage,
  onDeletePage,
  onToggleFavorite,
  onSearch,
  recentPages,
  favoritePages,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const [activeSection, setActiveSection] = useState<'all' | 'favorites' | 'recent'>('all');

  const handleNewPage = () => {
    if (workspace.templates.length > 0) {
      setShowTemplates(true);
    } else {
      onNewPage();
    }
  };

  const handleTemplateSelect = (templateId?: string) => {
    onNewPage(templateId);
    setShowTemplates(false);
  };

  const rootPages = workspace.pages.filter(page => !page.parentId);
  const displayPages = (() => {
    switch (activeSection) {
      case 'favorites':
        return favoritePages;
      case 'recent':
        return recentPages;
      default:
        return rootPages;
    }
  })();

  if (isCollapsed) {
    return (
      <div className="w-12 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
          title="Expand sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
          </svg>
        </button>
        
        <button
          onClick={() => onNewPage()}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
          title="New page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
        </button>
        
        <button
          onClick={onSearch}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
          title="Search"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">{workspace.name}</h1>
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
            title="Collapse sidebar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
            </svg>
          </button>
        </div>
        
        {/* Quick actions */}
        <div className="flex space-x-2">
          <button
            onClick={handleNewPage}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            New Page
          </button>
          <button
            onClick={onSearch}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            title="Search (Ctrl+/)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Section tabs */}
      <div className="px-6 py-3 border-b border-gray-200">
        <nav className="flex space-x-1">
          {[
            { id: 'all', label: 'All Pages', count: rootPages.length },
            { id: 'favorites', label: 'Favorites', count: favoritePages.length },
            { id: 'recent', label: 'Recent', count: recentPages.length },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`
                px-3 py-1 rounded-md text-sm font-medium transition-colors
                ${activeSection === section.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              {section.label}
              {section.count > 0 && (
                <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                  {section.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Pages list */}
      <div className="flex-1 overflow-y-auto p-4">
        <NavigationTree
          pages={displayPages}
          allPages={workspace.pages}
          currentPageId={currentPageId}
          onPageSelect={onPageSelect}
          onDeletePage={onDeletePage}
          onToggleFavorite={onToggleFavorite}
          showFavorites={activeSection !== 'favorites'}
        />
        
        {displayPages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <div className="text-sm text-gray-500">
              {activeSection === 'favorites' && 'No favorite pages yet'}
              {activeSection === 'recent' && 'No recent pages'}
              {activeSection === 'all' && 'No pages created yet'}
            </div>
            {activeSection === 'all' && (
              <button
                onClick={() => onNewPage()}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Create your first page
              </button>
            )}
          </div>
        )}
      </div>

      {/* Template selector modal */}
      {showTemplates && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 max-h-96 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Choose a template</h3>
              <p className="text-sm text-gray-500 mt-1">Start with a pre-built structure</p>
            </div>
            <div className="max-h-64 overflow-y-auto p-4">
              <div className="space-y-2">
                <button
                  onClick={() => handleTemplateSelect()}
                  className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">Blank Page</div>
                  <div className="text-sm text-gray-500">Start with an empty page</div>
                </button>
                {workspace.templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">{template.properties.icon || '📄'}</span>
                      <div>
                        <div className="font-medium text-gray-900">{template.name}</div>
                        <div className="text-sm text-gray-500">{template.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowTemplates(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}