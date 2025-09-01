'use client';

import { SearchResult } from '../../lib/types';

interface SearchResultsProps {
  results: SearchResult[];
  selectedIndex: number;
  onSelectResult: (result: SearchResult) => void;
  onHoverResult: (index: number) => void;
  getHighlightedContent: (content: string, query: string) => { text: string; isMatch: boolean }[];
  searchQuery: string;
}

export function SearchResults({
  results,
  selectedIndex,
  onSelectResult,
  onHoverResult,
  getHighlightedContent,
  searchQuery,
}: SearchResultsProps) {
  const groupedResults = groupResultsByPage(results);

  return (
    <div className="py-2">
      {groupedResults.map((group, groupIndex) => (
        <div key={group.pageId} className="mb-4 last:mb-0">
          {/* Page header */}
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <span className="text-lg">📄</span>
              <h3 className="font-medium text-gray-900 truncate">
                {getHighlightedContent(group.pageTitle, searchQuery).map((part, index) => (
                  <span
                    key={index}
                    className={part.isMatch ? 'bg-yellow-200 font-semibold' : ''}
                  >
                    {part.text}
                  </span>
                ))}
              </h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {group.results.length} match{group.results.length !== 1 ? 'es' : ''}
              </span>
            </div>
          </div>

          {/* Results for this page */}
          <div className="space-y-1">
            {group.results.map((result, resultIndex) => {
              const globalIndex = getGlobalIndex(groupedResults, groupIndex, resultIndex);
              const isSelected = globalIndex === selectedIndex;

              return (
                <button
                  key={`${result.pageId}-${result.blockId || 'title'}`}
                  onClick={() => onSelectResult(result)}
                  onMouseEnter={() => onHoverResult(globalIndex)}
                  className={`
                    w-full px-4 py-3 text-left transition-colors border-l-2
                    ${isSelected 
                      ? 'bg-blue-50 border-blue-500 text-blue-900' 
                      : 'border-transparent hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    {/* Result type icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {result.matchType === 'title' ? (
                        <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
                            <path d="M5,4V7H10.5V19H13.5V7H19V4H5Z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Result content */}
                    <div className="flex-1 min-w-0">
                      {result.matchType === 'title' ? (
                        <div className="text-sm font-medium text-gray-900">
                          Page title match
                        </div>
                      ) : (
                        <div className="text-sm text-gray-900 line-clamp-2">
                          {result.blockContent && getHighlightedContent(result.blockContent, searchQuery).map((part, index) => (
                            <span
                              key={index}
                              className={part.isMatch ? 'bg-yellow-200 font-semibold' : ''}
                            >
                              {part.text}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Match type indicator */}
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span className="capitalize">{result.matchType}</span>
                        {result.score && (
                          <span className="ml-2">
                            • Relevance: {Math.round(result.score)}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Navigate arrow */}
                    <div className="flex-shrink-0">
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="text-gray-400"
                      >
                        <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                      </svg>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper function to group results by page
function groupResultsByPage(results: SearchResult[]) {
  const groups: Array<{
    pageId: string;
    pageTitle: string;
    results: SearchResult[];
  }> = [];

  const pageMap = new Map<string, typeof groups[0]>();

  results.forEach(result => {
    if (!pageMap.has(result.pageId)) {
      pageMap.set(result.pageId, {
        pageId: result.pageId,
        pageTitle: result.pageTitle,
        results: [],
      });
      groups.push(pageMap.get(result.pageId)!);
    }
    pageMap.get(result.pageId)!.results.push(result);
  });

  return groups;
}

// Helper function to get global index for keyboard navigation
function getGlobalIndex(
  groupedResults: ReturnType<typeof groupResultsByPage>,
  groupIndex: number,
  resultIndex: number
): number {
  let globalIndex = 0;
  
  for (let i = 0; i < groupIndex; i++) {
    globalIndex += groupedResults[i].results.length;
  }
  
  return globalIndex + resultIndex;
}