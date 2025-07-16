import React from 'react';
import { Modal, ModalPortal, ModalOverlay } from '@/components/spring-ui/modal';
import { CloseDefaultIcon } from '@/icons';
import { Badge } from '@/components/spring-ui/badge';
import { Input } from '@/components/spring-ui/input';

interface AssetDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: any; // You can type this more strictly if desired
}

const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ open, onOpenChange, asset }) => {
  const [filename, setFilename] = React.useState('');
  
  React.useEffect(() => {
    if (asset) {
      setFilename(getFilename(asset));
    }
  }, [asset]);

  if (!asset) return null;

  // Function to get file type from asset
  const getFileType = (asset: any) => {
    // Use the type property if it exists (for mock assets)
    if (asset.type && asset.type !== 'images' && asset.type !== 'videos' && asset.type !== 'documents') {
      return asset.type;
    }
    // Fall back to extracting from filename
    if (asset.name) {
      const extension = asset.name.split('.').pop()?.toUpperCase();
      return extension || 'Unknown';
    }
    return 'Unknown';
  };

  // Function to get filename without extension
  const getFilename = (asset: any) => {
    if (asset.name) {
      const lastDotIndex = asset.name.lastIndexOf('.');
      return lastDotIndex > 0 ? asset.name.substring(0, lastDotIndex) : asset.name;
    }
    return asset.name || 'Unknown';
  };
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalPortal>
        <ModalOverlay />
        <div className="fixed left-[50%] top-[50%] z-50 w-[480px] translate-x-[-50%] translate-y-[-50%] bg-[var(--bg-primary)] shadow-[var(--shadow-menu-elevated)] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 rounded-[4px] !w-screen !h-screen max-w-none max-h-none flex flex-col p-0">
          {/* Custom Modal Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">{asset.title || filename}</h2>
              <Badge variant="default" size="comfort" shape="square">
                {getFileType(asset)}
              </Badge>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <CloseDefaultIcon size={20} />
            </button>
          </div>
          
          {/* Modal Content */}
          <div className="flex-1 flex flex-col">
            
            <div className="flex flex-1">
              {/* Left Column - Large Image */}
              <div className="flex-1 flex items-center justify-center">
                <div className="asset-image-wrapper bg-gray-100 flex items-center justify-center overflow-hidden px-10 h-full w-full">
                  <img 
                    src={asset.url}
                    alt={asset.name}
                    className="object-contain w-auto h-auto"
                    style={{ maxWidth: 'calc(100% - 80px)', maxHeight: 'calc(100vh - 200px)' }}
                  />
                </div>
              </div>
              
              {/* Right Column - Metadata */}
              <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto">
                
                <div className="space-y-4">
                                  <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">File Name</h3>
                  <Input
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        // Update the asset name with the new filename
                        asset.name = filename + '.' + getFileType(asset).toLowerCase();
                      }
                    }}
                    className="text-sm"
                  />
                </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">File Size</h3>
                    <p className="text-sm text-gray-900">{asset.fileSize}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Uploaded By</h3>
                    <p className="text-sm text-gray-900">{asset.uploadedBy}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Uploaded Date</h3>
                    <p className="text-sm text-gray-900">{asset.uploadedDate}</p>
                  </div>
                                  <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Last Modified</h3>
                  <p className="text-sm text-gray-900">{asset.lastModifiedDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Alt Text</h3>
                  <p className="text-sm text-gray-900">{asset.altText || 'No alt text provided'}</p>
                </div>
                </div>
                
                
              </div>
            </div>
          </div>
        </div>
      </ModalPortal>
    </Modal>
  );
};

export default AssetDetailModal; 