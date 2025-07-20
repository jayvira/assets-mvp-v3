import React from 'react';

interface ColorPickerCardProps {
  onClick?: () => void;
  className?: string;
}

const ColorPickerCard: React.FC<ColorPickerCardProps> = ({ 
  onClick, 
  className = '' 
}) => {
  return (
    <div 
      className={`flex flex-col items-center gap-2 cursor-pointer w-fit ${className}`}
      onClick={onClick}
    >
      <div className="w-24 h-24 rounded-lg relative overflow-hidden">
        {/* Rainbow gradient background */}
        <div 
          className="w-full h-full rounded-lg"
          style={{
            background: 'conic-gradient(from 0deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3, #FF0000)',
          }}
        />
        {/* White inner square with plus sign */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 5V19M5 12H19" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <span className="text-sm text-[var(--text-secondary)]">
        Add new
      </span>
    </div>
  );
};

export default ColorPickerCard; 