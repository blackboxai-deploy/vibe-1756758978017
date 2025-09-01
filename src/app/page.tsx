'use client';

import { AppLayout } from '../components/layout/AppLayout';
import { PageView } from '../components/pages/PageView';
import { SearchModal } from '../components/search/SearchModal';
import { usePages } from '../hooks/usePages';
import { useSearch } from '../hooks/useSearch';
import { Page } from '../lib/types';

export default function Home() {
  const {
    currentPage,
    currentPageId,
    setCurrentPageId,
    updatePage,
  } = usePages();

  const {
    searchResults,
    isSearchOpen,
    search,
    closeSearch,
    getHighlightedContent,
  } = useSearch(currentPage ? [currentPage] : []);

  const handleUpdateCurrentPage = (updates: Partial<Page>) => {
    if (currentPageId && currentPage) {
      updatePage(currentPageId, updates);
    }
  };

  const handleSearchResult = (result: any) => {
    if (result.pageId !== currentPageId) {
      setCurrentPageId(result.pageId);
    }
    // TODO: Scroll to specific block if blockId is provided
  };

  return (
    <>
      <AppLayout>
        {currentPage ? (
          <PageView
            page={currentPage}
            onUpdatePage={handleUpdateCurrentPage}
            editable={true}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to your workspace
              </h2>
              <p className="text-gray-600 mb-6">
                Create your first page to get started
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Create a page
              </button>
            </div>
          </div>
        )}
      </AppLayout>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={closeSearch}
        searchResults={searchResults}
        onSearch={search}
        onSelectResult={handleSearchResult}
        getHighlightedContent={getHighlightedContent}
      />
    </>
  );
}