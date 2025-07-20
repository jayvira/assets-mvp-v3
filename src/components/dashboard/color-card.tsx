import React from 'react';

interface ColorCardProps {
  color: string;
  hexCode: string;
  className?: string;
  onClick?: () => void;
}

const ColorCard: React.FC<ColorCardProps> = ({ 
  color, 
  hexCode, 
  className = '', 
  onClick 
}) => {
  const isWhite = color.toLowerCase() === '#ffffff' || color.toLowerCase() === '#fff';
  
  return (
    <div 
      className={`flex flex-col items-center gap-2 cursor-pointer w-fit ${className}`}
      onClick={onClick}
    >
      <div 
        className="w-24 h-24 rounded-lg border border-[var(--border-default)]"
        style={{ 
          backgroundColor: color,
          borderColor: isWhite ? '#e5e7eb' : 'transparent'
        }}
      />
      <span className="text-sm text-[var(--text-primary)] font-mono">
        {hexCode}
      </span>
    </div>
  );
};

export default ColorCard; 