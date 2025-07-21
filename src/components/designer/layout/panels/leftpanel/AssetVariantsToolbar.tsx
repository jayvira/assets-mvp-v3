import React from 'react';
import { AddIcon } from '@/icons/AddIcon';
import { Badge } from '@/components/spring-ui/badge';

interface AssetVariant {
  id: string;
  name: string;
  url: string;
  isSelected?: boolean;
  badge?: string;
}

interface AssetVariantsToolbarProps {
  variants: AssetVariant[];
  selectedVariantId?: string;
  onVariantSelect?: (variantId: string) => void;
  onAddVariant?: () => void;
  className?: string;
}

const AssetVariantsToolbar: React.FC<AssetVariantsToolbarProps> = ({
  variants,
  selectedVariantId,
  onVariantSelect,
  onAddVariant,
  className = ''
}) => {
  return (
    <div className={`w-24 bg-white border-r border-gray-200 flex flex-col items-center py-4 px-3 space-y-4 ${className}`}>
      {/* Add Button */}
      <button
        onClick={onAddVariant}
        className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
        aria-label="Add asset variant"
      >
        <AddIcon className="w-8 h-8 text-gray-600" />
      </button>

      {/* Separator */}
      <div className="w-8 h-px bg-gray-200" />

      {/* Variant Thumbnails */}
      <div className="flex flex-col space-y-3">
        {variants.map((variant, index) => (
          <button
            key={variant.id}
            onClick={() => onVariantSelect?.(variant.id)}
            className={`w-16 h-16 rounded-lg overflow-hidden transition-all relative ${
              selectedVariantId === variant.id
                ? 'ring-2 ring-blue-500 ring-offset-2'
                : 'hover:ring-1 hover:ring-gray-300'
            }`}
            aria-label={`Select variant ${variant.name}`}
          >
            <img
              src={variant.url}
              alt={variant.name}
              className={`w-full h-full object-cover ${
                selectedVariantId !== variant.id ? 'filter blur-[0.5px]' : ''
              }`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.style.backgroundColor = '#f3f4f6';
              }}
            />
            {selectedVariantId !== variant.id && (
              <div className="absolute inset-0 bg-white opacity-30"></div>
            )}
            {variant.badge && variant.badge === 'Top performing' ? (
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full" style={{ backgroundColor: '#259D4D' }}></div>
            ) : variant.badge ? (
              <Badge 
                variant="default" 
                size="compact" 
                className="absolute -bottom-0.5 left-0 right-0 text-[6px] px-0.5 py-0 bg-blue-500 text-white text-center h-3"
              >
                {variant.badge}
              </Badge>
            ) : null}
          </button>
        ))}


      </div>

      {/* Bottom separator */}
      <div className="w-8 h-px bg-gray-200 mt-auto" />
    </div>
  );
};

export default AssetVariantsToolbar; 