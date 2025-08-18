"use client";

import React from 'react';
import { Badge } from '@/components/spring-ui/badge';
import { IconButton } from '@/components/spring-ui/icon-button';
import { MoreIcon } from '@/icons/MoreIcon';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/spring-ui/dropdown-menu';

interface VersionCardProps {
  id: string;
  version: string;
  fileName: string;
  fileSize: string;
  uploadedBy: string;
  uploadedDate: string;
  notes?: string;
  url?: string;
  isCurrent?: boolean;
  showCurrentBadge?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onClick?: () => void;
  className?: string;
}

const VersionCard: React.FC<VersionCardProps> = ({ 
  id, 
  version, 
  fileName, 
  fileSize, 
  uploadedBy, 
  uploadedDate, 
  notes, 
  url, 
  isCurrent = false,
  showCurrentBadge = true,
  isSelected = false,
  onSelect,
  onClick,
  className 
}) => {
  // Get placeholder image
  const getPlaceholderImage = () => {
    return 'https://placehold.co/200x200/e2e8f0/64748b?text=Version';
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect();
    }
    if (onClick) onClick();
  };

  return (
    <div
      className={`relative flex items-stretch rounded-md border overflow-hidden h-[80px] ${
        isSelected
          ? 'border border-blue-500 bg-blue-50'
          : isCurrent
          ? 'border border-[var(--border-default)] bg-[var(--background-default)]'
          : 'border border-[var(--border-default)] hover:border-[#D1D1D1] bg-[var(--background-default)]'
      } cursor-pointer transition-colors ${className || ''}`}
      onClick={handleClick}
      tabIndex={0}
      role="button"
    >
      {/* Asset Thumbnail */}
      <div 
        className="w-20 flex-shrink-0 relative"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
            linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
          `,
          backgroundSize: '8px 8px',
          backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <img 
            src={url || getPlaceholderImage()} 
            alt={`${fileName} - ${version}`}
            className={`max-w-full max-h-full object-contain ${!isCurrent ? 'opacity-65' : ''}`}
          />
        </div>
        
        {/* Version Badge overlaid on thumbnail */}
        <div className="absolute top-1 left-1">
          <Badge 
            variant="default" 
            size="compact"
            className={`text-[10px] px-1.5 py-0.5 ${isCurrent ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            {version}
          </Badge>
        </div>
      </div>

      {/* Version Info */}
      <div className="flex-1 min-w-0 p-3">
        {isCurrent && showCurrentBadge && (
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="default" size="compact" className="bg-green-100 text-green-700">
              Current
            </Badge>
          </div>
        )}
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-900 truncate">
            {fileName}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>{uploadedDate}</span>
            <span className="text-[10px]">•</span>
            <span>{uploadedBy}</span>
            <span className="text-[10px]">•</span>
            <span>{fileSize}</span>
          </div>
        </div>
      </div>

      {/* Menu Button for non-current versions */}
      {!isCurrent && (
        <div className="flex items-center justify-center w-8 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton 
                variant="ghost" 
                size="compact" 
                aria-label="Version options"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreIcon size={16} />
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                Restore
              </DropdownMenuItem>
              <DropdownMenuItem>
                Download
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

export default VersionCard;