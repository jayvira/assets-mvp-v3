import React from 'react';
import { StackIcon } from '@/icons/StackIcon';
import { ChevronLargeLeftIcon } from '@/icons/ChevronLargeLeftIcon';
import { TabNewIcon } from '@/icons/TabNewIcon';
import { DuplicateFillIcon } from '@/icons/DuplicateFillIcon';
import { IconButton } from '@/components/spring-ui/icon-button';
import { Badge } from '@/components/spring-ui/badge';
import { Button } from '@/components/spring-ui/button';
import { UploadIcon } from '@/icons/UploadIcon';
import { AssetManagerIcon } from '@/icons/AssetManagerIcon';
import { AISparkleIcon } from '@/icons/AISparkleIcon';
import AssetCard from './AssetCard';

interface RelatedAsset {
  id: string;
  name: string;
  url: string;
  fileSize: string;
  format: string;
  similarity?: number;
}

interface RelatedAssetsSectionProps {
  relatedAssets: RelatedAsset[];
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const RelatedAssetsSection: React.FC<RelatedAssetsSectionProps> = ({
  relatedAssets,
  isExpanded,
  onToggleExpanded
}) => {
  return (
    <div className={`flex flex-col transition-all duration-200 absolute left-0 top-0 z-10 h-full ${
      isExpanded ? 'w-64 bg-white border-r border-gray-200 shadow-lg' : 'w-16'
    }`}>
      <div className={`${isExpanded ? 'p-4 bg-white' : 'p-4'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconButton
              variant="ghost"
              size="comfortable"
              onClick={onToggleExpanded}
              aria-label="Toggle related assets panel"
              className="bg-white hover:bg-gray-100 border border-gray-300"
            >
              <StackIcon className="w-5 h-5 text-gray-600" />
            </IconButton>
            {isExpanded && (
              <h3 className="text-xs font-medium text-gray-900">Link Related Assets</h3>
            )}
          </div>
          {isExpanded && (
            <IconButton
              variant="ghost"
              size="compact"
              onClick={onToggleExpanded}
              aria-label="Collapse related assets panel"
            >
              <ChevronLargeLeftIcon 
                size={16} 
                className="text-gray-500 transition-transform duration-200"
              />
            </IconButton>
          )}
        </div>
      </div>
      
              {isExpanded && (
          <div className="flex-1 px-4 pt-2 pb-4 overflow-y-auto">
            {/* Empty State */}
            <div className="text-center py-6 mb-4 border-2 border-dashed border-gray-300 rounded">
              <p className="text-xs text-gray-500 mb-4">No related assets are linked</p>
              <div className="flex gap-2">
                <Button variant="outline" size="compact" className="flex-1 text-xs px-2 py-1">
                  <UploadIcon className="w-3 h-3 mr-1" />
                  Upload
                </Button>
                <Button variant="outline" size="compact" className="flex-1 text-xs px-2 py-1">
                  <AssetManagerIcon className="w-3 h-3 mr-1" />
                  Browse
                </Button>
              </div>
            </div>
            
            {/* Divider */}
            <hr className="border-t border-gray-200 mb-6" />
            
            {/* Similar Assets Header */}
            <div className="flex items-center gap-2 mb-3">
              <AISparkleIcon className="w-4 h-4 text-gray-600" />
              <h3 className="text-xs font-medium text-gray-900">Similar assets</h3>
            </div>
            
            <div className="space-y-3">
            {relatedAssets.map((relatedAsset, index) => (
                              <div key={index}>
                  <AssetCard
                    id={parseInt(relatedAsset.id)}
                    type="images"
                    icon={StackIcon}
                    name={relatedAsset.name}
                    url={relatedAsset.url}
                    assetUrl={relatedAsset.url}
                    isSelected={false}
                    selectable={false}
                    className="w-full max-h-36"
                  />
                </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatedAssetsSection; 