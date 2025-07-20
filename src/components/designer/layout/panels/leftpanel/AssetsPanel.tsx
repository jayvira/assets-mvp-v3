"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/spring-ui/input';
import { Button } from '@/components/spring-ui/button';
import { TabBar, TabBarItem } from '@/components/spring-ui/tab-bar';
import { 
  AddIcon,
  UploadIcon,
  ImageIcon,
  VideoIcon,
  CloseDefaultIcon
} from '@/icons';
import { MainDocsIcon } from '@/icons/MainDocsIcon';
import AssetCard from './AssetCard';
import PanelHeader from '../PanelHeader';
import { ASSETS } from '@/config/assets';
// import AssetDetailModal from './AssetDetailModal'; // Removed as it's replaced by a side panel

// Define asset types
type AssetType = 'all' | 'images' | 'videos' | 'documents';
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
};

// Use centralized assets data
const mockAssets: FullAssetItem[] = ASSETS.map(asset => ({
  id: asset.id,
  type: asset.fileType === 'Images' ? 'images' : asset.fileType === 'Videos' ? 'videos' : 'documents',
  icon: asset.icon === 'ImageIcon' ? ImageIcon : asset.icon === 'VideoIcon' ? VideoIcon : MainDocsIcon,
  name: asset.name,
  title: formatTitle(asset.name),
  fileSize: asset.fileSize,
  uploadedBy: asset.uploadedBy,
  uploadedDate: asset.uploadedDate.split('T')[0],
  lastModifiedDate: asset.dateModified.split('T')[0],
}));

// Update props interface for AssetsPanel
interface AssetsPanelProps {
  onAssetSelect: (asset: FullAssetItem | null) => void;
  selectedAssetId: number | null;
  onClose: () => void;
}

const AssetsPanel: React.FC<AssetsPanelProps> = ({ onAssetSelect, selectedAssetId, onClose }) => {
  const [activeTab, setActiveTab] = useState<AssetType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [assets, setAssets] = useState<FullAssetItem[]>([...mockAssets]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // Use FileReader for preview URL (for images/videos)
      // For now, just use a placeholder
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
      };
    });
    setAssets(prev => [...newAssets, ...prev]);
    // Reset input so same file can be uploaded again
    event.target.value = '';
  };

  // Handle clicks within the AssetsPanel
  const handlePanelClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const isAssetCardClick = target.closest('.asset-card');

    if (!isAssetCardClick && selectedAssetId !== null) {
      onAssetSelect(null);
    }
  };

  // Filter assets based on active tab and search query
  const filteredAssets = assets.filter(asset => {
    const matchesType = activeTab === 'all' || asset.type === activeTab;
    const matchesSearch = searchQuery === '' || 
      asset.type.includes(searchQuery.toLowerCase()) || 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()); // Include title in search
    return matchesType && matchesSearch;
  });

  const handleAssetClick = (assetId: number) => {
    if (selectedAssetId === assetId) {
      onAssetSelect(null);
    } else {
      const asset = mockAssets.find(a => a.id === assetId);
      if (asset) {
        onAssetSelect(asset);
      }
    }
  };

  return (
    <div className="flex flex-col h-full" onClick={handlePanelClick}>
      {/* Custom Panel Header */}
      <PanelHeader title="Assets" onClose={onClose} />

      {/* Search and Upload Section */}
      <div className="p-2 border-b border-[var(--border-default)]">
        <div className="relative mb-2">
          <Input 
            placeholder="Search assets..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Hidden file input for uploads */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          multiple
          onChange={handleFileChange}
        />
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadIcon size={16} className="mr-2" />
          Upload Asset
        </Button>
      </div>

      {/* Type Filter Tabs */}
      <div className="px-2 border-b border-[var(--border-default)]">
        <TabBar
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as AssetType)}
        >
          <TabBarItem value="all">All</TabBarItem>
          <TabBarItem value="images">Images</TabBarItem>
          <TabBarItem value="videos">Videos</TabBarItem>
          <TabBarItem value="documents">Documents</TabBarItem>
        </TabBar>
      </div>

      {/* Unified Asset Grid */}
      <div className="p-2 flex-grow overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          {filteredAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              id={asset.id}
              type={asset.type}
              icon={asset.icon}
              name={asset.name}
              onClick={() => handleAssetClick(asset.id)}
              isSelected={selectedAssetId === asset.id}
              className="asset-card"
            />
          ))}
        </div>
      </div>

      {/* Removed Asset Detail Modal as it's replaced by a side panel */}
    </div>
  );
};

export default AssetsPanel; 