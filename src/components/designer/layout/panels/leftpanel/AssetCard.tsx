"use client";

import React, { useState } from 'react';
import { Modal, ModalContent } from '@/components/spring-ui/modal';
import AssetDetailPanel from './AssetDetailPanel';
import { MainDocsIcon } from '@/icons/MainDocsIcon';

interface AssetCardProps {
  id: number;
  type: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  name: string;
  url?: string;
  onClick?: () => void;
  isSelected: boolean;
  className?: string;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  selectable?: boolean;
  assetUrl?: string; // Add real asset URL
  format?: string; // Add format from Supabase
}

const AssetCard: React.FC<AssetCardProps> = ({ id, type, icon: Icon, name, url, onClick, isSelected, className, selected = false, onSelect, selectable = true, assetUrl, format }) => {
  // Get placeholder image based on asset type
  const getPlaceholderImage = () => {
    switch (type) {
      case 'images':
        return 'https://placehold.co/400x400/e2e8f0/64748b?text=Image';
      case 'videos':
        return 'https://placehold.co/400x400/e2e8f0/64748b?text=Video';
      case 'documents':
        return 'https://placehold.co/400x400/e2e8f0/64748b?text=Document';
      default:
        return 'https://placehold.co/400x400/e2e8f0/64748b?text=Asset';
    }
  };

  // Check if asset is a document based on Supabase format
  const isDocument = () => {
    return format?.toLowerCase() === 'document' || 
           format?.toLowerCase().includes('pdf') ||
           format?.toLowerCase().includes('doc') ||
           type === 'documents';
  };

  const [hovered, setHovered] = useState(false);

  // Asset data for detail modal
  const assetDetail = {
    id,
    type: type as 'images' | 'videos' | 'documents',
    name,
    fileSize: '',
    uploadedBy: '',
    uploadedDate: '',
    lastModifiedDate: '',
    title: name,
    url,
  };

  return (
    <div
      className={`relative flex flex-col rounded-md border overflow-hidden ${
        selected
          ? 'border-2 border-[#146EF5]'
          : 'border border-[var(--border-default)] hover:border-[#D1D1D1]'
      } bg-[var(--background-default)] cursor-pointer transition-colors group ${className || ''}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      tabIndex={0}
      role="checkbox"
      aria-checked={selected}
    >
      {/* Asset Thumbnail */}
      <div 
        className="aspect-square relative overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
            linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
          `,
          backgroundSize: '12px 12px',
          backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px'
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          {isDocument() ? (
            <div className="w-full h-full relative">
              {/* White background area positioned 24px from left, top, and right, extending to bottom */}
              <div 
                className="absolute bg-white shadow-sm flex items-center justify-center"
                style={{
                  left: '24px',
                  top: '24px',
                  right: '24px',
                  bottom: '0px',
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px',
                  borderBottomLeftRadius: '0px',
                  borderBottomRightRadius: '0px'
                }}
              >
                <MainDocsIcon 
                  size={64} 
                  className="text-gray-600" 
                  style={{ 
                    minWidth: '64px', 
                    minHeight: '64px',
                    flexShrink: 0 
                  }} 
                />
              </div>
            </div>
          ) : (
            <img 
              src={assetUrl || url || getPlaceholderImage()} 
              alt={name}
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>
        {/* Checkbox on hover or if selected - only show if selectable */}
        {selectable && (hovered || selected) && (
          <div className="absolute top-2 left-2 z-10">
            <input
              type="checkbox"
              checked={selected}
              tabIndex={-1}
              className="w-4 h-4 accent-blue-600 rounded border-gray-300 pointer-events-auto"
              onChange={e => {
                e.stopPropagation();
                onSelect?.(e.target.checked);
              }}
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}
      </div>
      {/* Asset Info - Horizontal Flex Box */}
      <div className="flex items-center gap-2 p-2 border-t border-[var(--border-default)]">
        <span className="$heading truncate">{name}</span>
      </div>
    </div>
  );
};

export default AssetCard; 