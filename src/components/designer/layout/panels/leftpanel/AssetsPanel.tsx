"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/spring-ui/input';
import { IconButton } from '@/components/spring-ui/icon-button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/spring-ui/select';
import { 
  AddIcon,
  UploadIcon,
  ImageIcon,
  VideoIcon,
  CloseDefaultIcon
} from '@/icons';
import { MainDocsIcon } from '@/icons/MainDocsIcon';
import { AssetManagerIcon } from '@/icons/AssetManagerIcon';
import { AISparkleIcon } from '@/icons/AISparkleIcon';
import AssetCardDesigner from './AssetCardDesigner';
import PanelHeader from '../PanelHeader';
import { getAssetsForSite, Asset } from '@/lib/supabase';
import { useSidebarPanel } from '../../LeftSidebar';

// Define asset types
type AssetItemType = 'images' | 'videos' | 'documents';

// Helper function to capitalize the first letter of each word and remove file extension
const formatTitle = (fileName: string): string => {
  const nameWithoutExtension = fileName.split('.')[0];
  return nameWithoutExtension
    .split(/[-_]+/) // Split by hyphens or underscores
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Define the full Asset data type with metadata and a new 'title' field
type FullAssetItem = {
  id: number;
  type: AssetItemType;
  icon: any;
  name: string; // This is the file name
  title: string; // This is the display title (e.g., 'Hero Image')
  fileSize: string;
  uploadedBy: string;
  uploadedDate: string;
  lastModifiedDate: string;
  url: string; // Add the real asset URL
  fileType: string; // Add fileType for filtering
  tags: string[]; // Add tags for filtering
  status: string; // Add status for filtering
};

// Update props interface for AssetsPanel
interface AssetsPanelProps {
  onAssetSelect: (asset: FullAssetItem | null) => void;
  selectedAssetId: number | null;
  onClose: () => void;
  isDetailPanelOpen?: boolean; // Add prop to indicate if detail panel is open
}

const AssetsPanel: React.FC<AssetsPanelProps> = ({ onAssetSelect, selectedAssetId, onClose, isDetailPanelOpen = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [assets, setAssets] = useState<FullAssetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { onAssetSelected, isReplaceMode } = useSidebarPanel(); // Get the asset selection handler and replace mode from context
  const [objectUrls, setObjectUrls] = useState<string[]>([]); // Track object URLs for cleanup
  
  // Filter states
  const [selectedFileType, setSelectedFileType] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Available filter options
  const [availableFileTypes, setAvailableFileTypes] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);

  // Fetch assets from Supabase on component mount
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        console.log('Fetching assets for Site 1...');
        // Fetch assets for Site 1 (Forme.com)
        const supabaseAssets = await getAssetsForSite("1");
        console.log('Supabase assets received:', supabaseAssets.length);
        
        // Transform Supabase assets to FullAssetItem format
        const transformedAssets: FullAssetItem[] = supabaseAssets.map(asset => ({
          id: asset.id,
          type: asset.fileType === 'Images' ? 'images' : asset.fileType === 'Videos' ? 'videos' : 'documents',
          icon: asset.icon === 'ImageIcon' ? ImageIcon : asset.icon === 'VideoIcon' ? VideoIcon : MainDocsIcon,
          name: asset.name,
          title: formatTitle(asset.name),
          fileSize: asset.fileSize,
          uploadedBy: asset.uploadedBy,
          uploadedDate: asset.uploadedDate.split('T')[0],
          lastModifiedDate: asset.dateModified.split('T')[0],
          url: asset.url,
          fileType: asset.fileType,
          tags: asset.tags || [],
          status: asset.status,
        }));
        
        console.log('Transformed assets:', transformedAssets.length);
        setAssets(transformedAssets);
        
        // Extract available filter options from assets
        const fileTypeSet = new Set<string>();
        const tagSet = new Set<string>();
        const statusSet = new Set<string>();
        
        transformedAssets.forEach(asset => {
          if (asset.fileType) fileTypeSet.add(asset.fileType);
          if (asset.tags && Array.isArray(asset.tags)) {
            asset.tags.forEach(tag => tagSet.add(tag));
          }
          if (asset.status) statusSet.add(asset.status);
        });
        
        setAvailableFileTypes(Array.from(fileTypeSet).sort());
        setAvailableTags(Array.from(tagSet).sort());
        setAvailableStatuses(Array.from(statusSet).sort());
      } catch (error) {
        console.error('Error fetching assets:', error);
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      objectUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [objectUrls]);

  // Handle file uploads
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const uploadedBy = 'Current User'; // Replace with real user if available
    const uploadedDate = new Date().toISOString().split('T')[0];
    const lastModifiedDate = uploadedDate;
    const newAssets: FullAssetItem[] = Array.from(files).map((file, idx) => {
      // Determine type by file extension
      let type: AssetItemType = 'documents';
      if (file.type.startsWith('image/')) type = 'images';
      else if (file.type.startsWith('video/')) type = 'videos';
      // Format file size
      const fileSize = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(1)} KB`;
      // Generate preview URL for uploaded files
      const previewUrl = URL.createObjectURL(file);
      // Track the object URL for cleanup
      setObjectUrls(prev => [...prev, previewUrl]);
      return {
        id: Date.now() + idx,
        type,
        icon: type === 'images' ? ImageIcon : type === 'videos' ? VideoIcon : MainDocsIcon,
        name: file.name,
        title: formatTitle(file.name),
        fileSize,
        uploadedBy,
        uploadedDate,
        lastModifiedDate,
        url: previewUrl, // Use the generated preview URL
        fileType: type === 'images' ? 'Images' : type === 'videos' ? 'Videos' : 'Documents',
        tags: [],
        status: 'No status',
      };
    });
    setAssets(prev => [...newAssets, ...prev]);
    // Reset input so same file can be uploaded again
    event.target.value = '';
  };

  // Handle upload button click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle clicks within the AssetsPanel
  const handlePanelClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const isAssetCardClick = target.closest('.asset-card');
    const isSelectClick = target.closest('[data-radix-select-trigger]') || 
                         target.closest('[data-radix-select-content]') ||
                         target.closest('[data-radix-select-item]') ||
                         target.closest('[role="option"]') ||
                         target.closest('[role="listbox"]') ||
                         target.closest('[role="combobox"]') ||
                         target.closest('[data-radix-portal]');

    if (!isAssetCardClick && !isSelectClick && selectedAssetId !== null) {
      onAssetSelect(null);
    }
  };

  // Handle Select component clicks to prevent panel closure
  const handleSelectClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  // Handle clicks outside of open Select dropdowns to prevent panel closure
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if the click is on a Select component or its content
      const isSelectClick = target.closest('[data-radix-select-trigger]') || 
                           target.closest('[data-radix-select-content]') ||
                           target.closest('[data-radix-select-item]') ||
                           target.closest('[role="option"]') ||
                           target.closest('[role="listbox"]') ||
                           target.closest('[role="combobox"]') ||
                           target.closest('[data-radix-portal]') ||
                           target.closest('[data-radix-popper-content-wrapper]');
      
      // If it's a Select click, prevent the panel from closing
      if (isSelectClick) {
        event.stopPropagation();
      }
    };

    document.addEventListener('click', handleDocumentClick, true);
    
    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, []);

  // Filter assets based on active tab, search query, and filter selections
  const filteredAssets = assets.filter(asset => {
    const matchesType = true; // No activeTab, so all assets are matched
    const matchesSearch = searchQuery === '' || 
      asset.type.includes(searchQuery.toLowerCase()) || 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()); // Include title in search
    const matchesFileType = selectedFileType === 'all' || selectedFileType === '' || asset.fileType === selectedFileType;
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => asset.tags && asset.tags.includes(tag));
    const matchesStatus = selectedStatus === 'all' || selectedStatus === '' || asset.status === selectedStatus;
    
    return matchesType && matchesSearch && matchesFileType && matchesTags && matchesStatus;
  });

  const handleAssetClick = (assetId: number) => {
    if (selectedAssetId === assetId) {
      onAssetSelect(null);
    } else {
      const asset = assets.find(a => a.id === assetId);
      if (asset) {
        if (isReplaceMode) {
          // Replace mode: update hero image and close panel
          if (onAssetSelected) {
            const assetData = assets.find(a => a.id === assetId);
            if (assetData) {
              onAssetSelected(assetData);
            }
          }
        } else {
          // Normal mode: select asset for detail panel
          onAssetSelect(asset);
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Custom Panel Header with upload button */}
      <div className="px-2 py-3 flex items-center justify-between">
        <h2 className="title-text-bold">Assets</h2>
        <div className="flex items-center gap-1">
          {/* Hidden file input for uploads */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            multiple
            onChange={handleFileChange}
          />
          <IconButton
            variant="ghost"
            size="comfortable"
            onClick={handleUploadClick}
            title="Upload Asset"
          >
            <UploadIcon size={16} />
          </IconButton>
          <IconButton
            variant="ghost"
            size="comfortable"
            onClick={() => window.open('https://marys-prototypes.webflow.io/asset-vision/dashboard/assets/overview', '_blank')}
            title="Manage Assets"
          >
            <AssetManagerIcon size={16} />
          </IconButton>
          {onClose && (
            <IconButton
              variant="ghost"
              size="comfortable"
              onClick={onClose}
              title="Close"
            >
              <CloseDefaultIcon size={16} />
            </IconButton>
          )}
        </div>
      </div>

      {/* Search Section */}
      <div className="p-2 border-b border-[var(--border-default)]">
        <div className="relative mb-2">
          <Input 
            placeholder="Search assets..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Filter Section */}
        <div 
          className="grid grid-cols-3 gap-2"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
        >
          {/* File Type Filter */}
          <Select value={selectedFileType} onValueChange={setSelectedFileType}>
            <SelectTrigger onClick={handleSelectClick}>
              <SelectValue placeholder="File Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {availableFileTypes.map(fileType => (
                <SelectItem key={fileType} value={fileType}>
                  {fileType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Tags Filter */}
          <Select 
            value={selectedTags.length > 0 ? selectedTags[0] : 'all'} 
            onValueChange={(value) => setSelectedTags(value === 'all' ? [] : [value])}
          >
            <SelectTrigger onClick={handleSelectClick}>
              <SelectValue placeholder="Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {availableTags.map(tag => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger onClick={handleSelectClick}>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {availableStatuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Suggested Assets Section */}
      {!loading && assets.length > 0 && (
        <div className="suggestedassets-wrapper p-2">
          <div className="p-2 overflow-hidden rounded-lg" style={{ backgroundColor: 'rgba(0, 125, 240, 0.1)' }}>
            <h3 className="text-xs font-medium text-[var(--text-primary)] mb-3 flex items-center gap-1">
              <AISparkleIcon size={12} />
              Suggested assets
            </h3>
            <div className="relative">
              <div className="flex gap-2">
                {[61, 62, 63, 64].map((assetId) => {
                  const asset = assets.find(a => a.id === assetId);
                  if (!asset) return null;
                  
                  return (
                    <div key={`suggested-${asset.id}`} className="flex-shrink-0 w-20">
                      <AssetCardDesigner
                        id={asset.id}
                        type={asset.type}
                        icon={asset.icon}
                        name={asset.name}
                        onClick={() => handleAssetClick(asset.id)}
                        isSelected={isReplaceMode ? false : selectedAssetId === asset.id}
                        className="asset-card"
                        assetUrl={asset.url}
                        isDetailPanelOpen={!isReplaceMode && isDetailPanelOpen && selectedAssetId === asset.id}
                      />
                    </div>
                  );
                })}
              </div>
              {/* Gradient fade effect to suggest more content */}
              <div className="absolute top-0 right-[-8px] w-8 h-full bg-gradient-to-l from-[#25313D] to-transparent pointer-events-none z-10"></div>
            </div>
          </div>
        </div>
      )}

      {/* Unified Asset Grid */}
      <div 
        className="p-2 flex-grow overflow-y-auto"
        onClick={(event) => {
          const target = event.target as HTMLElement;
          const isAssetCardClick = target.closest('.asset-card');
          if (!isAssetCardClick && selectedAssetId !== null) {
            onAssetSelect(null);
          }
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          {loading ? (
            <p>Loading assets...</p>
          ) : filteredAssets.length === 0 ? (
            <p>No assets found.</p>
          ) : (
            filteredAssets.map((asset) => (
              <AssetCardDesigner
                key={asset.id}
                id={asset.id}
                type={asset.type}
                icon={asset.icon}
                name={asset.name}
                onClick={() => handleAssetClick(asset.id)}
                isSelected={isReplaceMode ? false : selectedAssetId === asset.id} // Only show selection in normal mode
                className="asset-card"
                assetUrl={asset.url}
                isDetailPanelOpen={!isReplaceMode && isDetailPanelOpen && selectedAssetId === asset.id} // Only show detail panel in normal mode
              />
            ))
          )}
        </div>
      </div>

      {/* Removed Asset Detail Modal as it's replaced by a side panel */}
    </div>
  );
};

export default AssetsPanel; 