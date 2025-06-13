import React from 'react';
import { Button } from '@/components/spring-ui/button';
import { CloseDefaultIcon } from '@/icons';

// Re-use the FullAssetItem type from AssetsPanel for consistency
interface FullAssetItem {
  id: number;
  type: 'images' | 'videos' | 'documents';
  name: string;
  fileSize: string;
  uploadedBy: string;
  uploadedDate: string;
  lastModifiedDate: string;
  title: string;
}

interface AssetDetailPanelProps {
  asset: FullAssetItem | null; // Use the FullAssetItem type
  onClose: () => void;
}

const AssetDetailPanel: React.FC<AssetDetailPanelProps> = ({ asset, onClose }) => {
  if (!asset) return null;

  // Get placeholder image based on asset type
  const getPlaceholderImage = () => {
    switch (asset.type) {
      case 'images':
        return 'https://placehold.co/800x450/e2e8f0/64748b?text=Image';
      case 'videos':
        return 'https://placehold.co/800x450/e2e8f0/64748b?text=Video';
      case 'documents':
        return 'https://placehold.co/800x450/e2e8f0/64748b?text=Document';
      default:
        return 'https://placehold.co/800x450/e2e8f0/64748b?text=Asset';
    }
  };

  return (
    <div className="flex flex-col h-full w-[400px] border-l border-[var(--border-default)]">
      {/* Panel Header for Asset Details */}
      <div className="flex items-center justify-between border-b border-[var(--border-default)] p-2">
        <h2 className="text-sm font-medium text-[var(--text-primary)]">Asset Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <CloseDefaultIcon size={16} />
        </Button>
      </div>

      {/* Asset Preview */}
      <div className="aspect-video bg-[var(--background-secondary)] mb-4 flex items-center justify-center overflow-hidden flex-shrink-0">
        <img 
          src={getPlaceholderImage()} 
          alt={asset.name}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Asset Details */}
      <div className="space-y-4 p-4 flex-grow overflow-y-auto">
        {/* New Title for Asset */}
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">{asset.title}</h2>
        
        {/* New Metadata List */}
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">File Name</h3>
            <p className="text-sm text-[var(--text-primary)] break-all">{asset.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">File Size</h3>
            <p className="text-sm text-[var(--text-primary)]">{asset.fileSize}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">Uploaded By</h3>
            <p className="text-sm text-[var(--text-primary)]">{asset.uploadedBy}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">Uploaded Date</h3>
            <p className="text-sm text-[var(--text-primary)]">{asset.uploadedDate}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">Last Modified</h3>
            <p className="text-sm text-[var(--text-primary)]">{asset.lastModifiedDate}</p>
          </div>
        </div>

      </div>

      {/* Action Button */}
      <div className="p-4 border-t border-[var(--border-default)] flex justify-end flex-shrink-0">
        <Button
          onClick={() => {
            // Handle asset use/insert
            console.log('Use asset:', asset.id);
            onClose();
          }}
          className="w-full"
        >
          Use Asset
        </Button>
      </div>
    </div>
  );
};

export default AssetDetailPanel; 