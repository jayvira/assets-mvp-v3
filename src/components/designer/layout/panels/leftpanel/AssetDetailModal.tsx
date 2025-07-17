import React from 'react';
import { Modal, ModalPortal, ModalOverlay } from '@/components/spring-ui/modal';
import { CloseDefaultIcon } from '@/icons';
import { Badge } from '@/components/spring-ui/badge';
import { Input } from '@/components/spring-ui/input';
import { Textarea } from '@/components/spring-ui/textarea';
import { TabBar, TabBarItem } from '@/components/spring-ui/tab-bar';
import { TabNewIcon } from '@/icons/TabNewIcon';
import { IconButton } from '@/components/spring-ui/icon-button';
import { DuplicateFillIcon } from '@/icons/DuplicateFillIcon';
import { AISparkleIcon } from '@/icons/AISparkleIcon';
import { BuyIcon } from '@/icons/BuyIcon';
import { Button } from '@/components/spring-ui/button';
import { MoreIcon } from '@/icons/MoreIcon';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/spring-ui/dropdown-menu';
import { ArchiveIcon } from '@/icons/ArchiveIcon';
import { ChevronLargeLeftIcon } from '@/icons/ChevronLargeLeftIcon';
import { ChevronLargeRightIcon } from '@/icons/ChevronLargeRightIcon';
import { TagPill } from '@/components/TagPill';

interface AssetDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: any; // You can type this more strictly if desired
  assets?: any[]; // New: list of assets for navigation
  currentIndex?: number; // New: index of current asset
  onAssetChange?: (newIndex: number) => void; // New: handler for navigation
}

const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ open, onOpenChange, asset, assets, currentIndex, onAssetChange }) => {
  const [filename, setFilename] = React.useState('');
  const [editingFilename, setEditingFilename] = React.useState('');
  const [altText, setAltText] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('details');
  const [selectedTags, setSelectedTags] = React.useState<string[]>(asset?.tags || []);
  const [customTag, setCustomTag] = React.useState('');

  // Keyboard navigation for left/right arrows
  React.useEffect(() => {
    if (!open || !Array.isArray(assets) || typeof currentIndex !== 'number' || !onAssetChange) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onAssetChange(currentIndex - 1);
        e.preventDefault();
      } else if (e.key === 'ArrowRight' && currentIndex < assets.length - 1) {
        onAssetChange(currentIndex + 1);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, assets, currentIndex, onAssetChange]);

  React.useEffect(() => {
    if (asset) {
      const initialName = getFilename(asset);
      setFilename(initialName);
      setEditingFilename(initialName);
      setAltText(asset.altText || '');
      setSelectedTags(asset?.tags || []);
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="space-y-5">
            <div>
              <h3 className="text-black/60 mb-1">File Name</h3>
              <Input
                type="text"
                value={editingFilename}
                onChange={(e) => setEditingFilename(e.target.value)}
                onBlur={() => {
                  setFilename(editingFilename);
                  asset.name = editingFilename + '.' + getFileType(asset).toLowerCase();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setFilename(editingFilename);
                    asset.name = editingFilename + '.' + getFileType(asset).toLowerCase();
                  }
                }}
                className="text-sm shadow-none"
              />
            </div>
            <div>
              <h3 className="text-black/60 mb-1">File Info</h3>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-900">{asset.fileSize}</span>
                <span className="text-sm text-gray-300">•</span>
                <span className="text-sm text-gray-900">{asset.width && asset.height ? `${asset.width} × ${asset.height}` : ''}</span>
                <span className="text-sm text-gray-300">•</span>
                <span className="text-sm text-gray-900">{getFileType(asset)}</span>
              </div>
              {asset.url && (
                <div className="flex items-center gap-1 mt-1">
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-black/60 hover:underline truncate overflow-hidden whitespace-nowrap max-w-full"
                  >
                    {asset.url}
                  </a>
                  <TabNewIcon className="text-gray-500 w-4 h-4 flex-shrink-0" />
                  <IconButton variant="ghost" size="compact" aria-label="Copy URL">
                    <DuplicateFillIcon className="w-4 h-4 text-gray-500" />
                  </IconButton>
                </div>
              )}
            </div>
            <hr className="border-t border-gray-200 mt-2 mb-6" />
            <div>
              <h3 className="text-black/60 mb-1">Alt Text</h3>
              <Textarea
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // Update the asset alt text
                    asset.altText = altText;
                  }
                }}
                className="text-sm"
                placeholder="Enter alt text for accessibility..."
              />
            </div>
            <div>
              <h3 className="text-black/60 mb-1">Uploaded</h3>
              <p className="text-sm text-gray-900">
                {asset.uploadedDate ? new Date(asset.uploadedDate).toLocaleDateString() : 'Unknown'}
                {asset.uploadedBy ? ` by ${asset.uploadedBy}` : ''}
              </p>
            </div>
            <div>
              <h3 className="text-black/60 mb-1">Last modified</h3>
              <p className="text-sm text-gray-900">
                {asset.dateModified ? new Date(asset.dateModified).toLocaleDateString() : 'Unknown'}
                {asset.uploadedBy ? ` by ${asset.uploadedBy}` : ''}
              </p>
            </div>
            {asset?.tags && asset.tags.length > 0 && (
              <>
                <hr className="border-t border-gray-200 mt-2 mb-6" style={{ marginBottom: '24px' }} />
                {/* Custom Tag Input */}
                <div className="flex items-center gap-2 mb-4">
                  <BuyIcon className="w-6 h-6 text-gray-400" />
                  <Input
                    type="text"
                    value={customTag}
                    onChange={e => setCustomTag(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && customTag.trim()) {
                        if (!selectedTags.includes(customTag.trim())) {
                          setSelectedTags([...selectedTags, customTag.trim()]);
                        }
                        setCustomTag('');
                      }
                    }}
                    placeholder="Add tags"
                    className="flex-1 shadow-none"
                  />
                </div>
                {/* End Custom Tag Input */}
                <div className="flex items-center gap-2">
                  <AISparkleIcon className="w-4 h-4 text-gray-400" />
                  {asset?.tags.map((tag: string) => (
                    <TagPill
                      key={tag}
                      tag={tag}
                      isSelected={selectedTags.includes(tag)}
                      onClick={() => {
                        const isSelected = selectedTags.includes(tag);
                        if (isSelected) {
                          setSelectedTags(selectedTags.filter(t => t !== tag));
                        } else {
                          setSelectedTags([...selectedTags, tag]);
                        }
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        );
      case 'site-usage':
        return (
          <div className="space-y-5">
            <div>
              <h3 className="text-black/60 mb-1">Pages Used</h3>
              <p className="text-sm text-gray-900">Pages found using this asset</p>
            </div>
            <div>
              <h3 className="text-black/60 mb-1">Components Used</h3>
              <p className="text-sm text-gray-900">Components found using this asset</p>
            </div>
            <div>
              <h3 className="text-black/60 mb-1">Usage Count</h3>
              <p className="text-sm text-gray-900">0 uses</p>
            </div>
          </div>
        );
      case 'versions':
        return (
          <div className="space-y-5">
            <div>
              <h3 className="text-black/60 mb-1">Current Version</h3>
              <p className="text-sm text-gray-900">{asset.version || 'V1'}</p>
            </div>
            <div>
              <h3 className="text-black/60 mb-1">Version History</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{asset.version || 'V1'}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-black/60 mb-1">Upload New Version</h3>
              <button className="w-full px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                Choose File
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalPortal>
        <ModalOverlay />
        <div className="fixed left-[50%] top-[50%] z-50 w-[480px] translate-x-[-50%] translate-y-[-50%] bg-[var(--bg-primary)] shadow-[var(--shadow-menu-elevated)] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 rounded-[4px] !w-screen !h-screen max-w-none max-h-none flex flex-col p-0">
          {/* Custom Modal Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">{filename}</h2>
              <Badge variant="default" size="comfort" shape="square">
                {getFileType(asset)}
              </Badge>
            </div>
            {/* Button wrapper */}
            <div className="flex flex-row gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton variant="subtle" aria-label="More options">
                    <MoreIcon />
                  </IconButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[160px]">
                  <DropdownMenuItem>
                    <DuplicateFillIcon className="mr-2 w-4 h-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ArchiveIcon className="mr-2 w-4 h-4" />
                    Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="default">Share</Button>
              <Button variant="primary">Download</Button>
              <IconButton variant="ghost" aria-label="Close" onClick={() => onOpenChange(false)}>
                <CloseDefaultIcon size={20} />
              </IconButton>
            </div>
          </div>
          
          {/* Modal Content */}
          <div className="flex-1 flex flex-col">
            
            <div className="flex flex-1">
              {/* Left Column - Large Image */}
              <div className="flex-1 flex flex-col items-center justify-center relative">
                <div 
                  className="asset-image-wrapper flex items-center justify-center overflow-hidden px-10 h-full w-full flex-1"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                      linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                      linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
                    `,
                    backgroundSize: '12px 12px',
                    backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px'
                  }}
                >
                  <img 
                    src={asset.url}
                    alt={asset.name}
                    className="object-contain w-auto h-auto"
                    style={{ maxWidth: 'calc(100% - 80px)', maxHeight: 'calc(100vh - 200px)' }}
                  />
                </div>
                {/* Navigation Toolbar */}
                {Array.isArray(assets) && typeof currentIndex === 'number' && assets.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center px-2 py-2 gap-4 z-10"
                    style={{ background: '#00000099', borderRadius: '8px' }}>
                    <IconButton
                      variant="ghost"
                      aria-label="Previous asset"
                      onClick={() => onAssetChange && onAssetChange(currentIndex - 1)}
                      disabled={currentIndex === 0}
                      size="compact"
                      style={{ color: '#fff' }}
                    >
                      <ChevronLargeLeftIcon size={28} style={{ color: '#fff' }} />
                    </IconButton>
                    <span className="title-text-bold text-white text-md min-w-[60px] text-center">
                      {currentIndex + 1} / {assets.length}
                    </span>
                    <IconButton
                      variant="ghost"
                      aria-label="Next asset"
                      onClick={() => onAssetChange && onAssetChange(currentIndex + 1)}
                      disabled={currentIndex === assets.length - 1}
                      size="compact"
                      style={{ color: '#fff' }}
                    >
                      <ChevronLargeRightIcon size={28} style={{ color: '#fff' }} />
                    </IconButton>
                  </div>
                )}
              </div>
              
              {/* Right Column - Metadata with Tabs */}
              <div className="w-96 bg-white border-l border-gray-200">               {/* Tab Bar */}
                <TabBar value={activeTab} onValueChange={setActiveTab} className="px-4">
                  <TabBarItem value="details" className="px-2">Details</TabBarItem>
                  <TabBarItem value="site-usage" className="px-2">Site Usage</TabBarItem>
                  <TabBarItem value="versions" className="px-2 flex items-center gap-2">
                    Versions
                    <Badge size="compact" variant="default" className="ml-1 text-[10px] text-black" style={{ backgroundColor: '#E8E8E8' }}>{asset.version || "V1"}</Badge>
                  </TabBarItem>
                </TabBar>
                
                {/* Tab Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {renderTabContent()}
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