"use client";

import React, { useState, useRef, useEffect } from 'react';
import { IconButton } from '@/components/spring-ui/icon-button';
import { Button } from '@/components/spring-ui/button';
import { Filter } from '@/components/spring-ui/filter';
import { SegmentedControl, SegmentedControlItem } from "@/components/spring-ui/segmented-control";
import { GridIcon, ListIcon } from "@/icons";
import { ArrowDownIcon } from '@/icons';
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
import AssetCardDesigner from '../../layout/panels/leftpanel/AssetCardDesigner';
import { getAssetsForSite, Asset, supabase } from '@/lib/supabase';
import AssetDetailModalDesigner from '../../layout/panels/leftpanel/AssetDetailModalDesigner';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/spring-ui/dropdown-menu";
import { Input } from '@/components/spring-ui/input';
import { getAllSites, getSiteNameById } from '@/config/sites';
import { SiteIcon } from '@/icons/SiteIcon';

// Get all sites
const allSites = getAllSites();

// Define asset types
type AssetItemType = 'images' | 'videos' | 'documents';

// Helper function to parse file size strings to bytes
const parseFileSizeToBytes = (fileSize: string): number => {
  if (!fileSize) return 0;
  
  const size = parseFloat(fileSize);
  if (fileSize.includes('KB')) return size * 1024;
  if (fileSize.includes('MB')) return size * 1024 * 1024;
  if (fileSize.includes('GB')) return size * 1024 * 1024 * 1024;
  
  return size; // Assume bytes if no unit specified
};

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
  altText?: string; // Add altText for accessibility
  width?: number; // Add width for image dimensions
  height?: number; // Add height for image dimensions
  version?: string; // Add version for asset versioning
  dateModified?: string; // Add date modified for sorting
};

interface AssetBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetSelect: (asset: FullAssetItem) => void;
}

export default function AssetBrowserModal({ isOpen, onClose, onAssetSelect }: AssetBrowserModalProps) {
  const [searchQuery, setSearchQuery] = useState<string>(() => '');
  const [assets, setAssets] = useState<FullAssetItem[]>(() => []);
  const [loading, setLoading] = useState<boolean>(() => true);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(() => null);
  const [tagSearchQuery, setTagSearchQuery] = useState<string>(() => '');
  const [assetDetailModalOpen, setAssetDetailModalOpen] = useState<boolean>(() => false);
  const [selectedAssetForModal, setSelectedAssetForModal] = useState<any>(() => null);
  const [sortDesc, setSortDesc] = useState<boolean>(() => true);
  const [sortCriteria, setSortCriteria] = useState<string>(() => 'Date uploaded');
  const [sortMenuOpen, setSortMenuOpen] = useState<boolean>(() => false);
  const [viewMode, setViewMode] = useState<'gallery' | 'list'>(() => 'gallery');
  
  // Filter states
  const [selectedFileType, setSelectedFileType] = useState<string>(() => 'all');
  const [selectedTags, setSelectedTags] = useState<string[]>(() => []);
  const [selectedStatus, setSelectedStatus] = useState<string>(() => 'all');
  const [selectedSite, setSelectedSite] = useState<string[]>(() => ["1"]); // Pre-select Forme.com (site 1)
  
  // Available filter options
  const [availableFileTypes, setAvailableFileTypes] = useState<string[]>(() => []);
  const [availableTags, setAvailableTags] = useState<string[]>(() => []);
  const [availableStatuses, setAvailableStatuses] = useState<string[]>(() => []);

  // Fetch assets from Supabase on component mount
  useEffect(() => {
    if (!isOpen) return;
    
    const fetchAssets = async () => {
      try {
        setLoading(true);
        console.log('Fetching assets for Site 1...');
        
        // Get assets for Site 1
        const supabaseAssets = await getAssetsForSite("1");
        console.log('Assets for Site 1 from getAssetsForSite:', supabaseAssets.length);
        
        // Transform Supabase assets to FullAssetItem format
        const transformedAssets: FullAssetItem[] = supabaseAssets.map(asset => ({
          id: asset.id,
          type: asset.fileType === 'Images' ? 'images' : asset.fileType === 'Videos' ? 'videos' : 'documents',
          icon: asset.icon === 'ImageIcon' ? ImageIcon : asset.icon === 'VideoIcon' ? VideoIcon : MainDocsIcon,
          name: asset.name,
          title: formatTitle(asset.name),
          fileSize: asset.fileSize,
          uploadedBy: asset.uploadedBy,
          uploadedDate: asset.uploadedDate ? asset.uploadedDate.split('T')[0] : new Date().toISOString().split('T')[0],
          lastModifiedDate: asset.dateModified ? asset.dateModified.split('T')[0] : new Date().toISOString().split('T')[0],
          url: asset.url,
          fileType: asset.fileType,
          tags: asset.tags || [],
          status: asset.status,
          altText: asset.altText || '',
          width: asset.width,
          height: asset.height,
          version: asset.version || 'V1',
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
  }, [isOpen]);

  // Filter assets based on search query and filter selections
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = searchQuery === '' || 
      asset.type.includes(searchQuery.toLowerCase()) || 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFileType = selectedFileType === 'all' || selectedFileType === '' || asset.fileType === selectedFileType;
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => asset.tags && asset.tags.includes(tag));
    const matchesStatus = selectedStatus === 'all' || selectedStatus === '' || asset.status === selectedStatus;
    
    return matchesSearch && matchesFileType && matchesTags && matchesStatus;
  }).sort((a, b) => {
    let comparison = 0;
    
    switch (sortCriteria) {
      case 'Name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'Date uploaded':
        const dateA = a.uploadedDate ? new Date(a.uploadedDate).getTime() : 0;
        const dateB = b.uploadedDate ? new Date(b.uploadedDate).getTime() : 0;
        comparison = dateA - dateB;
        break;
      case 'Date modified':
        const modDateA = a.dateModified ? new Date(a.dateModified).getTime() : 
                        a.uploadedDate ? new Date(a.uploadedDate).getTime() : 0;
        const modDateB = b.dateModified ? new Date(b.dateModified).getTime() : 
                        b.uploadedDate ? new Date(b.uploadedDate).getTime() : 0;
        comparison = modDateA - modDateB;
        break;
      case 'Size':
        try {
          const sizeA = parseFileSizeToBytes(a.fileSize);
          const sizeB = parseFileSizeToBytes(b.fileSize);
          comparison = sizeA - sizeB;
        } catch (error) {
          console.warn('Error parsing file size:', error, 'Asset A:', a.fileSize, 'Asset B:', b.fileSize);
          comparison = 0; // Fallback to no change in order
        }
        break;
      default:
        // Default to date uploaded
        const defaultDateA = a.uploadedDate ? new Date(a.uploadedDate).getTime() : 0;
        const defaultDateB = b.uploadedDate ? new Date(b.uploadedDate).getTime() : 0;
        comparison = defaultDateA - defaultDateB;
    }
    
    // Apply sort direction
    return sortDesc ? -comparison : comparison;
  });

  const handleAssetClick = (assetId: number) => {
    if (selectedAssetId === assetId) {
      setSelectedAssetId(null);
    } else {
      setSelectedAssetId(assetId);
    }
  };

  const handleAssetSelect = (assetId: number) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      onAssetSelect(asset);
      onClose();
    }
  };

  // Handle opening asset detail modal
  const handleOpenAssetDetailModal = async (asset: FullAssetItem) => {
    try {

      // Fetch the complete asset data from Supabase to ensure we have all fields
      const { data: completeAsset, error } = await supabase
        .from('Assets')
        .select('*')
        .eq('id', asset.id)
        .single();

      if (error) {
        console.error('Error fetching complete asset data:', error);
        // Fallback to the current asset data if fetching fails
        const modalAsset = {
          id: asset.id,
          type: asset.type,
          name: asset.name,
          fileSize: asset.fileSize || '96 kB',
          uploadedBy: asset.uploadedBy || 'Current User',
          uploadedDate: asset.uploadedDate || new Date().toISOString().split('T')[0],
          lastModifiedDate: asset.lastModifiedDate || new Date().toISOString().split('T')[0],
          title: asset.name,
          url: asset.url,
          altText: asset.altText || '',
          tags: asset.tags || [],
          status: asset.status || 'No status',
          fileType: asset.fileType,
          width: asset.width,
          height: asset.height,
          version: asset.version || 'V1'
        };
        setSelectedAssetForModal(modalAsset);
        setAssetDetailModalOpen(true);
        return;
      }


      if (completeAsset) {
        // Transform the complete Asset to the format expected by AssetDetailModalDesigner
        const modalAsset = {
          id: completeAsset.id,
          type: asset.type,
          name: completeAsset.name,
          fileSize: completeAsset.fileSize || '96 kB',
          uploadedBy: completeAsset.uploadedBy || 'Current User',
          uploadedDate: completeAsset.uploadedDate ? completeAsset.uploadedDate.split('T')[0] : new Date().toISOString().split('T')[0],
          lastModifiedDate: completeAsset.dateModified ? completeAsset.dateModified.split('T')[0] : new Date().toISOString().split('T')[0],
          title: completeAsset.name,
          url: completeAsset.url,
          altText: completeAsset.altText || '',
          tags: completeAsset.tags ? (Array.isArray(completeAsset.tags) ? completeAsset.tags : completeAsset.tags.split(', ')) : [],
          status: completeAsset.status || 'No status',
          fileType: completeAsset.fileType,
          width: completeAsset.width,
          height: completeAsset.height,
          version: completeAsset.version || 'V1'
        };

        setSelectedAssetForModal(modalAsset);
        setAssetDetailModalOpen(true);
      }
    } catch (error) {
      console.error('Error in handleOpenAssetDetailModal:', error);
      // Fallback to the current asset data if fetching fails
      const modalAsset = {
        id: asset.id,
        type: asset.type,
        name: asset.name,
        fileSize: asset.fileSize || '96 kB',
        uploadedBy: asset.uploadedBy || 'Current User',
        uploadedDate: asset.uploadedDate || new Date().toISOString().split('T')[0],
        lastModifiedDate: asset.lastModifiedDate || new Date().toISOString().split('T')[0],
        title: asset.name,
        url: asset.url,
        altText: asset.altText || '',
        tags: asset.tags || [],
        status: asset.status || 'No status',
        fileType: asset.fileType,
        width: asset.width,
        height: asset.height,
        version: asset.version || 'V1'
      };
      setSelectedAssetForModal(modalAsset);
      setAssetDetailModalOpen(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
    >
      <div className="bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-lg w-[1000px] h-[700px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)]">
          <h2 className="title-text-bold text-[var(--text-primary)]">Browse Assets</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="comfortable" onClick={() => {/* TODO: Implement upload logic */}}>
              <UploadIcon size={16} />
              Upload
            </Button>
            <IconButton
              variant="ghost"
              size="comfortable"
              onClick={onClose}
            >
              <CloseDefaultIcon size={16} />
            </IconButton>
          </div>
        </div>

        {/* Search Section */}
        <div className="p-4 border-b border-[var(--border-default)]">
          <div className="relative mb-4">
            <Input 
              placeholder="Search assets..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filter Tags Section */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Site filter */}
            <Filter 
              variant="default" 
              size="compact" 
              state={selectedSite.length > 0 ? "filled" : "empty"}
              onClear={() => setSelectedSite([])}
              dropdownContent={
                <>
                  {allSites.map(site => (
                    <DropdownMenuCheckboxItem 
                      key={site.id} 
                      checked={selectedSite.includes(site.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedSite(prev => [...prev, site.id]);
                        } else {
                          setSelectedSite(prev => prev.filter(id => id !== site.id));
                        }
                      }}
                    >
                      {site.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </>
              }
              ariaLabel="Site options"
            >
              <SiteIcon className="w-4 h-4" />
              {selectedSite.length === 0 ? 'Site' : selectedSite.map(id => getSiteNameById(id)).join(', ')}
            </Filter>

            {/* Tag filter */}
            <Filter 
              variant="default" 
              size="compact" 
              state={selectedTags.length > 0 ? "filled" : "empty"}
              onClear={() => { setSelectedTags([]); setTagSearchQuery(""); }}
              dropdownContent={
                <>
                  <div className="p-2">
                    <Input
                      type="text"
                      value={tagSearchQuery}
                      onChange={(e) => setTagSearchQuery(e.target.value)}
                      placeholder="Search tags..."
                      className="w-full"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                  {availableTags
                    .filter(tag => tag.toLowerCase().includes(tagSearchQuery.toLowerCase()))
                    .map(tag => (
                      <DropdownMenuCheckboxItem 
                        key={tag} 
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedTags(prev => [...prev, tag]);
                          } else {
                            setSelectedTags(prev => prev.filter(t => t !== tag));
                          }
                          setTagSearchQuery("");
                        }}
                      >
                        {tag}
                      </DropdownMenuCheckboxItem>
                    ))}
                </>
              }
              ariaLabel="Tag options"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M3 6a5 5 0 1 1 10 0c0 2.5-2.5 5.5-4.1 7.2a1 1 0 0 1-1.4 0C5.5 11.5 3 8.5 3 6Z" stroke="currentColor" strokeWidth="1.2"/></svg>
              {selectedTags.length === 0 ? 'Tags' : selectedTags.join(', ')}
            </Filter>

            {/* File Type filter */}
            <Filter 
              variant="default" 
              size="compact" 
              state={selectedFileType !== 'all' ? "filled" : "empty"}
              onClear={() => setSelectedFileType('all')}
              dropdownContent={
                <>
                  <DropdownMenuCheckboxItem 
                    checked={selectedFileType === 'all'}
                    onCheckedChange={() => setSelectedFileType('all')}
                  >
                    All Types
                  </DropdownMenuCheckboxItem>
                  {availableFileTypes.map(type => (
                    <DropdownMenuCheckboxItem 
                      key={type} 
                      checked={selectedFileType === type}
                      onCheckedChange={() => setSelectedFileType(type)}
                    >
                      {type}
                    </DropdownMenuCheckboxItem>
                  ))}
                </>
              }
              ariaLabel="File type options"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="3" y="5" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg>
              {selectedFileType === 'all' ? 'File type' : selectedFileType}
            </Filter>

            {/* Status filter */}
            <Filter 
              variant="default" 
              size="compact" 
              state={selectedStatus !== 'all' ? "filled" : "empty"}
              onClear={() => setSelectedStatus('all')}
              dropdownContent={
                <>
                  <DropdownMenuCheckboxItem 
                    checked={selectedStatus === 'all'}
                    onCheckedChange={() => setSelectedStatus('all')}
                  >
                    All Status
                  </DropdownMenuCheckboxItem>
                  {availableStatuses.map(status => (
                    <DropdownMenuCheckboxItem 
                      key={status} 
                      checked={selectedStatus === status}
                      onCheckedChange={() => setSelectedStatus(status)}
                    >
                      {status}
                    </DropdownMenuCheckboxItem>
                  ))}
                </>
              }
              ariaLabel="Status options"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/></svg>
              {selectedStatus === 'all' ? 'Status' : selectedStatus}
            </Filter>

            {/* Clear filters button */}
            <Button
              variant="ghost"
              size="compact"
              className={`max-h-[24px] ${(selectedTags.length > 0 || selectedFileType !== 'all' || selectedStatus !== 'all' || selectedSite.length !== 1 || searchQuery) ? '' : 'invisible'}`}
              disabled={!(selectedTags.length > 0 || selectedFileType !== 'all' || selectedStatus !== 'all' || selectedSite.length !== 1 || searchQuery)}
              onClick={() => {
                setSelectedTags([]);
                setSelectedFileType('all');
                setSelectedStatus('all');
                setSelectedSite(["1"]); // Reset to Forme.com
                setSearchQuery("");
                setTagSearchQuery("");
              }}
            >
              Clear
            </Button>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-4 ml-auto">
              <div className="sort flex items-center gap-1">
                <DropdownMenu open={sortMenuOpen} onOpenChange={setSortMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="compact"
                      className={`text-sm ${sortMenuOpen ? 'bg-[var(--bg-raised)]' : ''}`}
                    >
                      {sortCriteria}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem 
                      checked={sortCriteria === 'Name'}
                      onCheckedChange={() => setSortCriteria('Name')}
                    >
                      Name
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={sortCriteria === 'Date uploaded'}
                      onCheckedChange={() => setSortCriteria('Date uploaded')}
                    >
                      Date uploaded
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={sortCriteria === 'Date modified'}
                      onCheckedChange={() => setSortCriteria('Date modified')}
                    >
                      Date modified
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={sortCriteria === 'Size'}
                      onCheckedChange={() => setSortCriteria('Size')}
                    >
                      Size
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <IconButton
                  variant="ghost"
                  size="comfortable"
                  onClick={() => setSortDesc((v) => !v)}
                  aria-label="Toggle sort direction"
                >
                  <ArrowDownIcon 
                    size={16} 
                    className={`transition-transform duration-200 ${sortDesc ? '' : 'rotate-180'}`}
                  />
                </IconButton>
              </div>
              <SegmentedControl value={viewMode} onValueChange={(value) => setViewMode(value as 'gallery' | 'list')}>
                <SegmentedControlItem value="gallery" aria-label="Gallery view">
                  <GridIcon className="w-4 h-4" />
                </SegmentedControlItem>
                <SegmentedControlItem value="list" aria-label="List view">
                  <ListIcon className="w-4 h-4" />
                </SegmentedControlItem>
              </SegmentedControl>
            </div>
          </div>
        </div>

        {/* Suggested Assets Section - Hidden for now */}
        {/* 
        {!loading && assets.length > 0 && (
          <div className="p-4">
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
                          onClick={() => handleAssetSelect(asset.id)}
                          isSelected={false}
                          className="asset-card cursor-pointer"
                          assetUrl={asset.url}
                          isDetailPanelOpen={false}
                          multiSelect={false}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="absolute top-0 right-[-8px] w-8 h-full bg-gradient-to-l from-[#25313D] to-transparent pointer-events-none z-10"></div>
              </div>
            </div>
          </div>
        )}
        */}

        {/* Asset Display */}
        <div className="flex-1 p-4 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-[var(--text-primary)]"></div>
            </div>
          ) : filteredAssets.length === 0 ? (
            <p>No assets found.</p>
          ) : viewMode === 'gallery' ? (
            <div className="grid grid-cols-4 gap-4">
              {filteredAssets.map((asset) => (
                <AssetCardDesigner
                  key={asset.id}
                  id={asset.id}
                  type={asset.type}
                  icon={asset.icon}
                  name={asset.name}
                  onClick={() => handleAssetSelect(asset.id)}
                  isSelected={false}
                  className="asset-card cursor-pointer"
                  assetUrl={asset.url}
                  isDetailPanelOpen={false}
                  multiSelect={false}
                  onOpenAssetDetailModal={handleOpenAssetDetailModal}
                  fullAsset={asset}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="flex items-center gap-4 p-4 border border-[var(--border-default)] rounded hover:bg-[var(--bg-hover)]">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-[var(--bg-secondary)] rounded flex items-center justify-center">
                      {asset.icon === 'ImageIcon' ? <ImageIcon className="w-6 h-6" /> :
                       asset.icon === 'VideoIcon' ? <VideoIcon className="w-6 h-6" /> :
                       asset.icon === 'MainDocsIcon' ? <MainDocsIcon className="w-6 h-6" /> :
                       <ImageIcon className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-[var(--text-primary)]">{asset.name}</div>
                      <div className="text-sm text-[var(--text-secondary)]">{asset.fileSize} • {asset.uploadedBy}</div>
                    </div>
                    <div className="flex gap-2">
                      {asset.tags?.slice(0, 2).map((tag: string, index: number) => (
                        <div key={index} className="px-2 py-1 text-xs rounded bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                          {tag}
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">{asset.fileType}</div>
                    <Button
                      variant="ghost"
                      size="compact"
                      onClick={() => handleAssetSelect(asset.id)}
                    >
                      Select
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Asset Detail Modal */}
      {assetDetailModalOpen && selectedAssetForModal && (
        <AssetDetailModalDesigner
          open={assetDetailModalOpen}
          onOpenChange={setAssetDetailModalOpen}
          asset={selectedAssetForModal}
          isNested={true}
        />
      )}
    </div>
  );
} 