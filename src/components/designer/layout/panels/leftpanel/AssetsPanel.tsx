"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/spring-ui/input';
import { IconButton } from '@/components/spring-ui/icon-button';
import { Filter } from '@/components/spring-ui/filter';
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
import { getAssetsForSite, Asset, supabase } from '@/lib/supabase';
import { useSidebarPanel } from '../../LeftSidebar';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/spring-ui/dropdown-menu";
import { Button } from '@/components/spring-ui/button';
import { getAllSites, getSiteNameById } from '@/config/sites';
import { SiteIcon } from '@/icons/SiteIcon';
import { GridIcon } from "@/icons";
import { ArrowDownIcon } from '@/icons';
import { FolderOpenIcon, FolderDefaultIcon } from '@/icons';
import FolderDesigner from './FolderDesigner';

// Get all sites
const allSites = getAllSites();

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
  altText?: string; // Add altText for accessibility
  width?: number; // Add width for image dimensions
  height?: number; // Add height for image dimensions
  version?: string; // Add version for asset versioning
  sites?: { id: string }[]; // Add sites for filtering
};

// Define folder structure type
type FolderItem = {
  id: string;
  name: string;
  children?: FolderItem[];
  level: number;
};

// Update props interface for AssetsPanel
interface AssetsPanelProps {
  onAssetSelect: (asset: FullAssetItem | null) => void;
  selectedAssetId: number | null;
  onClose: () => void;
  isDetailPanelOpen?: boolean; // Add prop to indicate if detail panel is open
  onOpenAssetDetailModal?: (asset: any) => void; // Add prop to open asset detail modal
}

const AssetsPanel: React.FC<AssetsPanelProps> = ({ onAssetSelect, selectedAssetId, onClose, isDetailPanelOpen = false, onOpenAssetDetailModal }) => {
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
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [selectedSite, setSelectedSite] = useState<string[]>(["1"]); // Pre-select Forme.com
  const [sortDesc, setSortDesc] = useState(true);
  const [sortCriteria, setSortCriteria] = useState<string>('Date uploaded');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'gallery' | 'list'>('gallery');
  const [activeFolderId, setActiveFolderId] = useState<string>('1'); // Default to "All Assets"
  const [isFolderPanelCollapsed, setIsFolderPanelCollapsed] = useState(true);
  
  // Available filter options
  const [availableFileTypes, setAvailableFileTypes] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);

  // Folder structure data
  const [folderStructure] = useState<FolderItem[]>([
    { id: '1', name: 'All Assets', level: 0 },
    { id: '2', name: 'AI imagery', level: 0 },
    { id: '3', name: 'Award badges', level: 0 },
    { id: '4', name: 'Bio images', level: 0 },
    { id: '5', name: 'Blog images', level: 0 },
    { id: '6', name: 'CMS images', level: 0 },
    { id: '7', name: 'DE images', level: 0 },
    { id: '8', name: 'Featured resources images', level: 0 },
    { id: '9', name: 'Hero images', level: 0 },
    { id: '10', name: 'Logos', level: 0 },
    { id: '11', name: 'Lottie animations', level: 0, children: [
      { id: '11-1', name: 'DE - Lotties', level: 1 },
      { id: '11-2', name: 'UK - Lotties', level: 1 }
    ]},
    
    { id: '13', name: 'PDFs', level: 0 },
    { id: '14', name: 'Placeholder images', level: 0 },
    { id: '15', name: 'Product UI', level: 0 },
    { id: '16', name: 'SEO images', level: 0 },
    
  ]);

  // Fetch assets from Supabase on component mount
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        console.log('Fetching all assets...');
        
        // Fetch all assets from the database
        const { data: allAssetsData, error: allAssetsError } = await supabase
          .from('Assets')
          .select('*')
          .order('id', { ascending: true });
        
        if (allAssetsError) {
          console.error('Error fetching all assets:', allAssetsError);
          return;
        }
        
        // Transform all assets to FullAssetItem format
        const transformedAssets: FullAssetItem[] = allAssetsData?.map(asset => ({
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
          sites: asset.sites || [], // Include sites data for filtering
        })) || [];
        
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

  // Helper function to parse file size strings to bytes
  const parseFileSizeToBytes = (fileSize: string): number => {
    if (!fileSize) return 0;
    
    const size = parseFloat(fileSize);
    if (fileSize.includes('KB')) return size * 1024;
    if (fileSize.includes('MB')) return size * 1024 * 1024;
    if (fileSize.includes('GB')) return size * 1024 * 1024 * 1024;
    
    return size; // Assume bytes if no unit specified
  };

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
    const matchesSite = selectedSite.length === 0 || 
      (asset.sites && Array.isArray(asset.sites) && asset.sites.some(site => selectedSite.includes(site.id)));
    
    return matchesSearch && matchesFileType && matchesTags && matchesStatus && matchesSite;
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
        const modDateA = a.lastModifiedDate ? new Date(a.lastModifiedDate).getTime() : 
                        a.uploadedDate ? new Date(a.uploadedDate).getTime() : 0;
        const modDateB = b.lastModifiedDate ? new Date(b.lastModifiedDate).getTime() : 
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

  // Handle opening asset detail modal - ensure we pass complete asset data
  const handleOpenAssetDetailModal = (asset: FullAssetItem) => {
    if (onOpenAssetDetailModal) {
      // Transform the asset to the format expected by AssetDetailModalDesigner
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
      console.log('AssetsPanel - Opening asset detail modal with asset:', modalAsset);
      onOpenAssetDetailModal(modalAsset);
    }
  };

  // Render folder item recursively using FolderDesigner component
  const renderFolderItem = (folder: FolderItem, isFirst: boolean = false) => (
    <div key={folder.id}>
      <FolderDesigner
        name={folder.name}
        level={folder.level}
        hasChildren={folder.children && folder.children.length > 0}
        isExpanded={false} // You can add state management for this later
        onClick={() => {
          setActiveFolderId(folder.id);
          console.log('Folder clicked:', folder.name, 'ID:', folder.id, 'Active ID:', activeFolderId);
        }}
        onToggle={() => console.log('Folder toggle:', folder.name)}
        isFirstFolder={isFirst}
        isActive={activeFolderId === folder.id}
      />
      {folder.children && folder.children.map(child => renderFolderItem(child, false))}
    </div>
  );

  return (
    <div className="flex flex-col h-full w-[800px]">
              {/* Custom Panel Header with search and upload button */}
        <div className="px-4 py-3 flex items-center justify-between">
        <h2 className="title-text-bold">Assets</h2>
        <div className="flex items-center gap-3">
          {/* Hidden file input for uploads */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx"
            onChange={handleFileChange}
          />
          <div className="w-[260px]">
            <Input 
              placeholder="Search assets..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="comfortable"
            onClick={handleUploadClick}
          >
            <AddIcon size={16} />
            Upload
          </Button>
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

      {/* Filter Section */}
      <div className="p-2 border-b border-[var(--border-default)]">
        
        {/* Filter Section */}
        <div 
          className="flex items-center gap-2 flex-wrap"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
        >
          {/* Folder Panel Toggle Button */}
          <button
            onClick={() => setIsFolderPanelCollapsed(!isFolderPanelCollapsed)}
            className="h-6 px-1.5 flex items-center justify-center hover:bg-[var(--bg-hover)] rounded transition-colors border border-[var(--border-default)]"
            title={isFolderPanelCollapsed ? "Expand folder panel" : "Collapse folder panel"}
          >
            {isFolderPanelCollapsed ? (
              <FolderDefaultIcon size={12} className="text-[var(--text-secondary)]" />
            ) : (
              <FolderOpenIcon size={12} className="text-[var(--text-secondary)]" />
            )}
          </button>

          {/* Site Filter */}
          <Filter 
            variant="dark" 
            size="compact" 
            state={selectedSite.length > 0 ? "filled" : "empty"}
            onClear={() => setSelectedSite(["1"])} // Reset to Forme.com
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

          {/* File Type Filter */}
          <Filter 
            variant="dark"
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
                {availableFileTypes.map(fileType => (
                  <DropdownMenuCheckboxItem 
                    key={fileType} 
                    checked={selectedFileType === fileType}
                    onCheckedChange={() => setSelectedFileType(fileType)}
                  >
                    {fileType}
                  </DropdownMenuCheckboxItem>
                ))}
              </>
            }
            ariaLabel="File type options"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="3" y="5" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg>
            {selectedFileType === 'all' ? 'File Type' : selectedFileType}
          </Filter>

          {/* Tags Filter */}
          <Filter 
            variant="dark"
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
                    className={`text-xs ${sortMenuOpen ? 'bg-[var(--bg-raised)]' : ''}`}
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
            <IconButton
              variant="ghost"
              size="comfortable"
              title="Grid view"
            >
              <GridIcon size={16} />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Main Content Area with Folder Structure and Assets */}
      <div className="flex flex-1 overflow-hidden">
        {/* Folder Structure Sidebar */}
        <div className={`border-r border-[var(--border-default)] bg-[var(--background-primary)] overflow-y-auto transition-all duration-200 ${
          isFolderPanelCollapsed ? 'w-0' : 'w-48'
        }`}>
          {/* Folder Content */}
          {!isFolderPanelCollapsed && (
            <div className="p-3">
              <div className="space-y-1">
                {folderStructure.map((folder, index) => renderFolderItem(folder, index === 0))}
              </div>
            </div>
          )}
        </div>

                {/* Right Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden p-3">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* Suggested Assets Section */}
            {!loading && assets.length > 0 && (
              <div className="suggestedassets-wrapper p-1">
                <div className="p-2 overflow-hidden rounded-lg" style={{ backgroundColor: 'rgba(0, 125, 240, 0.1)' }}>
                  <h3 className="text-xs font-medium text-[var(--text-primary)] mb-2 flex items-center gap-1">
                    <AISparkleIcon size={12} />
                    Suggested assets
                  </h3>
                  <div className="relative">
                    <div className="flex gap-4">
                      {[61, 62, 63, 64, 65, 66, 67].map((assetId) => {
                        const asset = assets.find(a => a.id === assetId);
                        if (!asset) return null;
                        
                        return (
                          <div key={`suggested-${asset.id}`} className="flex-shrink-0 w-24">
                            <AssetCardDesigner
                              key={`suggested-${asset.id}`}
                              id={asset.id}
                              type={asset.type}
                              icon={asset.icon}
                              name=""
                              onClick={() => handleAssetClick(asset.id)}
                              isSelected={isReplaceMode ? false : selectedAssetId === asset.id}
                              className="asset-card"
                              assetUrl={asset.url}
                              isDetailPanelOpen={!isReplaceMode && isDetailPanelOpen && selectedAssetId === asset.id}
                              multiSelect={true}
                              onOpenAssetDetailModal={handleOpenAssetDetailModal}
                              fullAsset={asset}
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

            {/* Spacing between sections */}
            <div className="h-3" />

            {/* Asset Display Area */}
            <div 
              className="p-2"
              onClick={(event) => {
                const target = event.target as HTMLElement;
                const isAssetCardClick = target.closest('.asset-card');
                if (!isAssetCardClick && selectedAssetId !== null) {
                  onAssetSelect(null);
                }
              }}
            >
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
                  onClick={() => handleAssetClick(asset.id)}
                  isSelected={isReplaceMode ? false : selectedAssetId === asset.id}
                  className="asset-card"
                  assetUrl={asset.url}
                  isDetailPanelOpen={!isReplaceMode && isDetailPanelOpen && selectedAssetId === asset.id}
                  multiSelect={true}
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
                      onClick={() => handleAssetClick(asset.id)}
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
        </div>
      </div>

      {/* Removed Asset Detail Modal as it's replaced by a side panel */}
    </div>
  );
};

export default AssetsPanel; 