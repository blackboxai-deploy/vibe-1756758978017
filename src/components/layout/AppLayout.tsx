'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { usePages } from '../../hooks/usePages';
import { useSearch } from '../../hooks/useSearch';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    workspace,
    currentPage,
    currentPageId,
    setCurrentPageId,
    createPage,
    updatePage,
    deletePage,
    toggleFavorite,
    getRecentPages,
    getFavoritePages,
    loading,
  } = usePages();

  const {
    openSearch,
    handleSearchKeydown,
  } = useSearch(workspace?.pages || []);

  // Handle responsive sidebar
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    document.addEventListener('keydown', handleSearchKeydown);
    return () => document.removeEventListener('keydown', handleSearchKeydown);
  }, [handleSearchKeydown]);

  const handleNewPage = (templateId?: string) => {
    const pageId = createPage('Untitled', undefined, templateId);
    if (pageId) {
      setCurrentPageId(pageId);
    }
  };

  const handlePageSelect = (pageId: string) => {
    setCurrentPageId(pageId);
    
    // Auto-collapse sidebar on mobile after selection
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const handleUpdateCurrentPage = (updates: Partial<typeof currentPage>) => {
    if (currentPageId) {
      updatePage(currentPageId, updates);
    }
  };

  const handleDeletePage = (pageId: string) => {
    if (workspace && workspace.pages.length > 1) {
      deletePage(pageId);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading your workspace...</div>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" />
            </svg>
          </div>
          <div className="text-gray-900 font-medium mb-2">Failed to load workspace</div>
          <div className="text-gray-600">Please refresh the page to try again</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        workspace={workspace}
        currentPageId={currentPageId}
        onPageSelect={handlePageSelect}
        onNewPage={handleNewPage}
        onDeletePage={handleDeletePage}
        onToggleFavorite={toggleFavorite}
        onSearch={openSearch}
        recentPages={getRecentPages()}
        favoritePages={getFavoritePages()}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          currentPage={currentPage}
          onUpdatePage={handleUpdateCurrentPage}
          onSearch={openSearch}
          onToggleSidebar={toggleSidebar}
        />

        {/* Content */}
        <main className="flex-1 overflow-hidden bg-white">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  );
}