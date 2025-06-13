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

// Mock assets data - replace with real data later
const mockAssets: FullAssetItem[] = [
  { id: 1, type: 'images', icon: ImageIcon, name: 'hero-image.jpg', title: formatTitle('hero-image.jpg'), fileSize: '1.2 MB', uploadedBy: 'Alice Smith', uploadedDate: '2023-01-15', lastModifiedDate: '2023-01-20' },
  { id: 2, type: 'images', icon: ImageIcon, name: 'profile-pic.png', title: formatTitle('profile-pic.png'), fileSize: '0.5 MB', uploadedBy: 'Bob Johnson', uploadedDate: '2023-02-01', lastModifiedDate: '2023-02-01' },
  { id: 3, type: 'videos', icon: VideoIcon, name: 'product-demo.mp4', title: formatTitle('product-demo.mp4'), fileSize: '25.8 MB', uploadedBy: 'Charlie Brown', uploadedDate: '2023-03-10', lastModifiedDate: '2023-03-15' },
  { id: 4, type: 'videos', icon: VideoIcon, name: 'tutorial.mp4', title: formatTitle('tutorial.mp4'), fileSize: '18.1 MB', uploadedBy: 'Diana Prince', uploadedDate: '2023-04-05', lastModifiedDate: '2023-04-05' },
  { id: 5, type: 'documents', icon: MainDocsIcon, name: 'specs.pdf', title: formatTitle('specs.pdf'), fileSize: '3.4 MB', uploadedBy: 'Eve Adams', uploadedDate: '2023-05-20', lastModifiedDate: '2023-05-22' },
  { id: 6, type: 'documents', icon: MainDocsIcon, name: 'guide.docx', title: formatTitle('guide.docx'), fileSize: '0.8 MB', uploadedBy: 'Frank White', uploadedDate: '2023-06-01', lastModifiedDate: '2023-06-01' },
  { id: 7, type: 'images', icon: ImageIcon, name: 'banner.png', title: formatTitle('banner.png'), fileSize: '0.9 MB', uploadedBy: 'Grace Lee', uploadedDate: '2023-07-11', lastModifiedDate: '2023-07-12' },
  { id: 8, type: 'videos', icon: VideoIcon, name: 'intro.mp4', title: formatTitle('intro.mp4'), fileSize: '10.0 MB', uploadedBy: 'Harry Kim', uploadedDate: '2023-08-01', lastModifiedDate: '2023-08-01' },
];

// Update props interface for AssetsPanel
interface AssetsPanelProps {
  onAssetSelect: (asset: FullAssetItem | null) => void;
  selectedAssetId: number | null;
  onClose: () => void;
}

const AssetsPanel: React.FC<AssetsPanelProps> = ({ onAssetSelect, selectedAssetId, onClose }) => {
  const [activeTab, setActiveTab] = useState<AssetType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle clicks within the AssetsPanel
  const handlePanelClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const isAssetCardClick = target.closest('.asset-card');

    if (!isAssetCardClick && selectedAssetId !== null) {
      onAssetSelect(null);
    }
  };

  // Filter assets based on active tab and search query
  const filteredAssets = mockAssets.filter(asset => {
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
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {/* Handle upload */}}
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