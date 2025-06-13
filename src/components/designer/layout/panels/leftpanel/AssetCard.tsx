"use client";

import React from 'react';

interface AssetCardProps {
  id: number;
  type: 'images' | 'videos' | 'documents';
  icon: React.ComponentType<{ size?: number; className?: string }>;
  name: string;
  onClick?: () => void;
  isSelected: boolean;
  className?: string;
}

const AssetCard: React.FC<AssetCardProps> = ({ id, type, icon: Icon, name, onClick, isSelected, className }) => {
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

  return (
    <div 
      className={`flex flex-col rounded-md border ${isSelected ? 'border-blue-500' : 'border-[var(--border-default)]'} bg-[var(--background-default)] cursor-pointer transition-colors group ${className || ''}`}
      onClick={onClick}
    >
      {/* Asset Thumbnail */}
      <div className="aspect-square relative overflow-hidden">
        <img 
          src={getPlaceholderImage()} 
          alt={name}
          className="w-full h-full object-cover rounded-t-md"
        />
        {/* Darkening overlay on hover */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity rounded-t-md"></div>
      </div>
      
      {/* Asset Info - Horizontal Flex Box */}
      <div className="flex items-center gap-2 p-2 border-t border-[var(--border-default)]">
        <Icon size={16} className="text-[var(--text-secondary)]" />
        <span className="text-sm text-[var(--text-primary)] truncate">{name}</span>
      </div>
    </div>
  );
};

export default AssetCard; 