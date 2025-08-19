import React from 'react';
import { Button } from '@/components/spring-ui/button';
import { MoreIcon } from '@/icons/MoreIcon';
import { FolderDefaultIcon } from '@/icons/FolderDefaultIcon';

interface FolderCardProps {
  name: string;
  itemCount: number;
  onClick?: () => void;
  onMoreClick?: () => void;
}

const FolderCard: React.FC<FolderCardProps> = ({
  name,
  itemCount,
  onClick,
  onMoreClick
}) => {
  return (
    <div 
      className="flex h-20 bg-[var(--background-primary)] border border-[var(--border-default)] rounded-lg cursor-pointer hover:bg-[var(--bg-raised)] transition-colors"
      onClick={onClick}
    >
      <div className="flex-shrink-0 w-20 aspect-square flex items-center justify-center bg-[var(--bg-raised)] rounded-l-lg">
        <FolderDefaultIcon size={24} className="text-[var(--text-secondary)]" />
      </div>
      <div className="flex-1 min-w-0 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="body-text text-[var(--text-primary)] font-medium truncate">
            {name}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onMoreClick?.();
            }}
          >
            <MoreIcon size={16} className="text-[var(--text-secondary)]" />
          </Button>
        </div>
        <p className="caption-text text-[var(--text-secondary)]">{itemCount} items</p>
      </div>
    </div>
  );
};

export default FolderCard;