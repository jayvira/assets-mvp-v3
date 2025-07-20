import React from 'react';
import { IconButton } from '@/components/spring-ui/icon-button';
import { EditIcon } from '@/icons/EditIcon';
import { DeleteIcon } from '@/icons/DeleteIcon';

interface TypographyCardProps {
  textStyle: string;
  onClick?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  className?: string;
}

const TypographyCard: React.FC<TypographyCardProps> = ({ 
  textStyle, 
  onClick, 
  onDelete, 
  onEdit, 
  className = '' 
}) => {
  const getTypographyStyle = (style: string) => {
    switch (style) {
      case 'Title':
        return 'text-6xl font-bold text-[var(--text-primary)]';
      case 'Heading - H1':
        return 'text-5xl font-bold text-[var(--text-primary)]';
      case 'Heading - H2':
        return 'text-4xl font-semibold text-[var(--text-primary)]';
      case 'Heading - H3':
        return 'text-3xl font-semibold text-[var(--text-primary)]';
      case 'Heading - H4':
        return 'text-2xl font-medium text-[var(--text-primary)]';
      case 'Body':
        return 'text-base font-normal text-[var(--text-primary)]';
      case 'Quote':
        return 'text-lg font-medium italic text-[var(--text-primary)]';
      case 'Caption':
        return 'text-sm font-normal text-[var(--text-secondary)]';
      default:
        return 'text-base font-normal text-[var(--text-primary)]';
    }
  };

  return (
    <div 
      className={`flex items-center justify-between p-4 bg-[var(--background-primary)] border border-[var(--border-default)] rounded-lg hover:bg-[var(--background-secondary)] transition-colors cursor-pointer ${className}`}
      onClick={onClick}
    >
      <span className={getTypographyStyle(textStyle)}>
        {textStyle}
      </span>
      <div className="flex items-center gap-1">
        <IconButton
          variant="subtle"
          size="compact"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
        >
          <EditIcon size={16} />
        </IconButton>
        <IconButton
          variant="subtle"
          size="compact"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
        >
          <DeleteIcon size={16} />
        </IconButton>
      </div>
    </div>
  );
};

export default TypographyCard; 