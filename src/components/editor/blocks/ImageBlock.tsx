'use client';

import { useState } from 'react';
import { Block } from '../../../lib/types';

interface ImageBlockProps {
  block: Block;
  isSelected: boolean;
  isFocused: boolean;
  onUpdate: (updates: Partial<Block>) => void;
  onFocus: () => void;
  onBlur: () => void;
  onEnterKey: () => void;
  onBackspaceKey: () => void;
}

export function ImageBlock({ 
  block, 
  isSelected, 
  isFocused, 
  onUpdate, 
  onFocus, 
  onBlur,
  onEnterKey,
  onBackspaceKey 
}: ImageBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(block.properties?.imageUrl || '');
  const [imageAlt, setImageAlt] = useState(block.properties?.imageAlt || '');

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    onUpdate({
      properties: {
        ...block.properties,
        imageUrl: url,
      },
    });
  };

  const handleImageAltChange = (alt: string) => {
    setImageAlt(alt);
    onUpdate({
      properties: {
        ...block.properties,
        imageAlt: alt,
      },
    });
  };

  const handleFocus = () => {
    setIsEditing(true);
    onFocus();
  };

  const handleBlur = () => {
    setIsEditing(false);
    onBlur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onEnterKey();
      setIsEditing(false);
    }
    
    if (e.key === 'Backspace' && !imageUrl && !imageAlt && !e.shiftKey) {
      e.preventDefault();
      onBackspaceKey();
    }
  };

  const hasImage = imageUrl && imageUrl.trim() !== '';

  return (
    <div className={`
      group relative rounded-lg transition-all duration-200
      ${isSelected ? 'bg-blue-50 ring-2 ring-blue-200' : ''}
      ${isFocused ? 'ring-2 ring-blue-300' : ''}
      hover:bg-gray-50
    `}>
      <div className="p-4">
        {hasImage ? (
          <div className="space-y-3">
            {/* Image display */}
            <div className="relative">
              <img
                src={imageUrl}
                alt={imageAlt || 'Image'}
                className="max-w-full h-auto rounded-lg shadow-sm"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            
            {/* Image controls when selected/focused */}
            {(isSelected || isFocused || isEditing) && (
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder="Paste image URL..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alt text (optional)
                  </label>
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => handleImageAltChange(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe the image..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="space-y-4">
              <div className="text-gray-400">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Add an image</h3>
                <div className="space-y-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder="Paste image URL..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => handleImageAltChange(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder="Alt text (optional)..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Paste a URL or upload an image to get started
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Block actions - shown on hover */}
      <div className={`
        absolute left-0 top-4 -ml-8 flex opacity-0 transition-opacity
        ${(isSelected || isFocused) ? 'opacity-100' : 'group-hover:opacity-100'}
      `}>
        <div className="flex h-6 w-6 cursor-grab items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <circle cx="2" cy="2" r="1"/>
            <circle cx="6" cy="2" r="1"/>
            <circle cx="10" cy="2" r="1"/>
            <circle cx="2" cy="6" r="1"/>
            <circle cx="6" cy="6" r="1"/>
            <circle cx="10" cy="6" r="1"/>
            <circle cx="2" cy="10" r="1"/>
            <circle cx="6" cy="10" r="1"/>
            <circle cx="10" cy="10" r="1"/>
          </svg>
        </div>
      </div>
    </div>
  );
}