import React from 'react';

interface TagPillProps {
  tag: string;
  isSelected: boolean;
  onClick?: () => void;
}

export const TagPill: React.FC<TagPillProps> = ({ tag, isSelected, onClick }) => (
  <span
    onClick={onClick}
    className={
      'inline-flex items-center rounded-full pl-3 pr-2 h-6 text-xs font-normal cursor-pointer select-none transition-colors ' +
      (isSelected
        ? 'bg-gray-200 text-black border border-transparent'
        : 'bg-transparent text-black border border-gray-200')
    }
    style={{ minHeight: '24px', height: '24px' }}
  >
    {tag}
    {isSelected ? (
      <svg style={{ marginLeft: '6px' }} className="w-4 h-4" viewBox="0 0 20 20" fill="none">
        <path d="M5 10l4 4 6-6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ) : (
      <svg style={{ marginLeft: '6px' }} className="w-4 h-4" viewBox="0 0 20 20" fill="none">
        <path d="M10 5v10M5 10h10" stroke="black" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )}
  </span>
); 