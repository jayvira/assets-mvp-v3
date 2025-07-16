"use client";

import React, { useState } from 'react';

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
}

const AssetCard: React.FC<AssetCardProps> = ({ id, type, icon: Icon, name, url, onClick, isSelected, className, selected = false, onSelect }) => {
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

  return (
    <div
      className={`relative flex flex-col rounded-md border ${selected ? 'border-2 border-[#146EF5]' : 'border border-[var(--border-default)]'} bg-[var(--background-default)] cursor-pointer transition-colors group ${className || ''}`}
      onClick={e => {
        e.stopPropagation();
        onSelect?.(!selected);
        onClick?.();
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      tabIndex={0}
      role="checkbox"
      aria-checked={selected}
    >
      {/* Asset Thumbnail */}
      <div className="aspect-square relative overflow-hidden">
        <img 
          src={url || getPlaceholderImage()} 
          alt={name}
          className="w-full h-full object-cover rounded-t-md"
        />
        {/* Darkening overlay on hover */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity rounded-t-md"></div>
        {/* Checkbox on hover or if selected */}
        {(hovered || selected) && (
          <div className="absolute top-2 left-2 z-10">
            <input
              type="checkbox"
              checked={selected}
              readOnly
              tabIndex={-1}
              className="w-4 h-4 accent-blue-600 rounded border-gray-300 pointer-events-none"
            />
          </div>
        )}
      </div>
      
      {/* Asset Info - Horizontal Flex Box */}
      <div className="flex items-center gap-2 p-2 border-t border-[var(--border-default)]">
        <Icon size={16} className="text-[var(--text-secondary)]" />
        <span className="$heading truncate">{name}</span>
      </div>
    </div>
  );
};

export default AssetCard; 