"use client";

import React, { useState, useEffect } from 'react';
import AssetDetailModalDesigner from './AssetDetailModalDesigner';
import { IconButton } from '@/components/spring-ui/icon-button';
import { MoreIcon } from '@/icons/MoreIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/spring-ui/dropdown-menu';

interface AssetCardDesignerProps {
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
  isDetailPanelOpen?: boolean; // Add prop to indicate if detail panel is open
  multiSelect?: boolean; // Add prop to control multi-select functionality
  onOpenAssetDetailModal?: (asset: any) => void; // Add prop to open asset detail modal
  fullAsset?: any; // Add prop to receive complete asset data
}

const AssetCardDesigner: React.FC<AssetCardDesignerProps> = ({ 
  id, 
  type, 
  icon: Icon, 
  name, 
  url, 
  onClick, 
  isSelected, 
  className, 
  selected = false, 
  onSelect, 
  selectable = true, 
  assetUrl, 
  isDetailPanelOpen = false,
  multiSelect = true,
  onOpenAssetDetailModal,
  fullAsset
}) => {
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

  const [hovered, setHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Asset data for detail modal - use fullAsset if available, otherwise create basic object
  const assetDetail = fullAsset || {
    id,
    type: type as 'images' | 'videos' | 'documents',
    name,
    fileSize: '96 kB', // Add some default values
    uploadedBy: 'Current User',
    uploadedDate: new Date().toISOString().split('T')[0],
    lastModifiedDate: new Date().toISOString().split('T')[0],
    title: name,
    url: assetUrl || url,
  };

  // Handle view details click
  const handleViewDetails = () => {
    if (onOpenAssetDetailModal) {
      console.log('AssetCardDesigner - Opening modal with asset:', assetDetail);
      onOpenAssetDetailModal(assetDetail);
    }
    setDropdownOpen(false);
  };

  return (
    <div className="flex flex-col">
      <div
        className={`relative rounded-md border ${
          selected || isDetailPanelOpen
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
        <div className="aspect-square relative bg-white/5">
          <div className="absolute inset-0 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <img 
                src={assetUrl || url || getPlaceholderImage()} 
                alt={name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
          
          {/* More options button - only visible on hover */}
          <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="relative">
              <IconButton
                variant="ghost"
                size="comfortable"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
                className="bg-black/20 hover:bg-black/40 text-white"
              >
                <MoreIcon size={16} />
              </IconButton>
              
              {/* Custom dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-md shadow-lg z-50 min-w-[160px]">
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] border-b border-[var(--border-default)]"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('View details clicked');
                      handleViewDetails();
                      setDropdownOpen(false);
                    }}
                  >
                    View details
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] border-b border-[var(--border-default)]"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Edit image clicked');
                      setDropdownOpen(false);
                    }}
                  >
                    Edit Image
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] border-b border-[var(--border-default)]"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Compress clicked');
                      setDropdownOpen(false);
                    }}
                  >
                    Compress
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] border-b border-[var(--border-default)]"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Copy URL clicked');
                      setDropdownOpen(false);
                    }}
                  >
                    Copy URL
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-red-900/20 hover:text-red-400 text-red-400"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Delete clicked');
                      setDropdownOpen(false);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Checkbox on hover or if selected - only show if selectable and multiSelect is enabled */}
          {selectable && multiSelect && (hovered || selected) && (
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
      </div>
      
      {/* Asset Title - Outside the border */}
      <div className="mt-1">
        <span className="text-xs text-[var(--text-secondary)] truncate block">{name}</span>
      </div>

      {/* Asset Detail Panel Overlay */}
      {/* The AssetDetailModalDesigner component is now managed by the parent */}
    </div>
  );
};

export default AssetCardDesigner; 