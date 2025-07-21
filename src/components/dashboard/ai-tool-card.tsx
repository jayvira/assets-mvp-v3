import React from 'react';
import { Badge } from '@/components/spring-ui/badge';
import { Button } from '@/components/spring-ui/button';

export interface AIToolCardProps {
  /** The title of the AI tool */
  title: string;
  /** Description of what the tool does */
  description: string;
  /** Icon emoji, text, or React element to display */
  icon: string | React.ReactElement;
  /** Background color for the icon (Tailwind color class) */
  iconBgColor: string;
  /** Click handler for the card */
  onClick?: () => void;
  /** Click handler for the Open button */
  onOpenClick?: () => void;
  /** Custom className for additional styling */
  className?: string;
}

export function AIToolCard({
  title,
  description,
  icon,
  iconBgColor,
  onClick,
  onOpenClick,
  className = ""
}: AIToolCardProps) {
  const handleCardClick = () => {
    onClick?.();
  };

  const handleOpenClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenClick?.();
  };

  return (
    <div 
      className={`p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      <div className="flex items-start gap-3 justify-between">
        <div className={`w-10 h-10 ${iconBgColor} rounded flex items-center justify-center flex-shrink-0`}>
          {typeof icon === 'string' ? (
            <span className="text-white text-lg">{icon}</span>
          ) : (
            <div className="text-white">
              {icon}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="title-text-bold mb-1">{title}</h4>
          <p className="text-xs text-[var(--text-secondary)]">{description}</p>
        </div>
      </div>
    </div>
  );
} 