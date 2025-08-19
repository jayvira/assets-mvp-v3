import React from 'react';
import { GridIcon } from '@/icons/GridIcon';

export interface FolderDesignerProps {
  name: string;
  level: number;
  hasChildren?: boolean;
  isExpanded?: boolean;
  onClick?: () => void;
  onToggle?: () => void;
  className?: string;
  isFirstFolder?: boolean;
  isActive?: boolean;
}

const FolderDesigner: React.FC<FolderDesignerProps> = ({
  name,
  level,
  hasChildren = false,
  isExpanded = false,
  onClick,
  onToggle,
  className = '',
  isFirstFolder = false,
  isActive = false
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggle) {
      onToggle();
    }
  };

  return (
    <div>
      <div 
        className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer transition-colors ${
          isActive 
            ? 'bg-[var(--bg-raised)]' 
            : 'hover:bg-[var(--bg-hover)]'
        } ${className}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
      >
        {/* Icon - Grid for first folder, folder icon for others */}
        {isFirstFolder ? (
          <GridIcon size={16} className="flex-shrink-0 text-[var(--text-primary)]" />
        ) : (
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 16 16" 
            fill="none" 
            className="flex-shrink-0 text-[var(--text-secondary)]"
          >
            <path 
              d="M2 4C2 3.44772 2.44772 3 3 3H6.5L8 4.5H13C13.5523 4.5 14 4.94772 14 5.5V12C14 12.5523 13.5523 13 13 13H3C2.44772 13 2 12.5523 2 12V4Z" 
              stroke="currentColor" 
              strokeWidth="1.2"
            />
          </svg>
        )}

        {/* Folder Name */}
        <span className={`text-xs truncate flex-1 ${
          isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
        }`}>
          {name}
        </span>

        {/* Expand/Collapse Icon (only show if folder has children) */}
        {hasChildren && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`flex-shrink-0 text-[var(--text-secondary)] transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
            onClick={handleToggle}
          >
            <path
              d="M4.5 3L7.5 6L4.5 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      
      {/* Divider under the first folder */}
      {isFirstFolder && (
        <div className="mx-3 my-2 border-t border-[var(--border-default)]" />
      )}
    </div>
  );
};

export default FolderDesigner; 