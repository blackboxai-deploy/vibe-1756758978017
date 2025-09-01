'use client';

import { Page } from '../../lib/types';
import { BlockEditor } from '../editor/BlockEditor';

interface PageViewProps {
  page: Page;
  onUpdatePage: (updates: Partial<Page>) => void;
  editable?: boolean;
}

export function PageView({ page, onUpdatePage, editable = true }: PageViewProps) {
  const handleBlocksChange = (blocks: typeof page.blocks) => {
    onUpdatePage({ blocks });
  };

  if (!editable) {
    return (
      <div className="max-w-4xl mx-auto">
        <BlockEditor
          initialBlocks={page.blocks}
          editable={false}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Page content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <BlockEditor
            initialBlocks={page.blocks}
            onChange={handleBlocksChange}
            placeholder="Start writing your page..."
            editable={editable}
          />
        </div>
      </div>
    </div>
  );
}