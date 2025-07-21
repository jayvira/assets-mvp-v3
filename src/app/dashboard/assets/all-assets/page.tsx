"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AssetCard from "@/components/designer/layout/panels/leftpanel/AssetCard";
import { ImageIcon, VideoIcon, MainDocsIcon } from "@/icons";
import { FaThLarge, FaList } from "react-icons/fa";
import AssetDetailModal from "@/components/designer/layout/panels/leftpanel/AssetDetailModal";
import { Button } from '@/components/spring-ui/button';
import { IconButton } from '@/components/spring-ui/icon-button';
import { AddIcon } from '@/icons/AddIcon';
import { SiteIcon } from '@/icons/SiteIcon';
import { TagPill } from '@/components/TagPill';
import { CloseDefaultIcon, DownloadIcon, ArchiveIcon } from '@/icons';
import { getAllSites, getSiteNameById } from '@/config/sites';
import { getAllAssets } from '@/lib/supabase';

// Mock data constants - using centralized sites configuration
const allSites = getAllSites();

const allFileTypes = ["Images", "Videos", "Documents", "Illustrator & Vector Graphics"];

const allStatuses = ["Approved", "Needs Edit", "In Progress", "Needs Review", "No status"];

export default function AllAssetsPage() {
  const searchParams = useSearchParams();
  const [selectedAssetIds, setSelectedAssetIds] = useState<number[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [showAssetDetailModal, setShowAssetDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFileType, setSelectedFileType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [viewMode, setViewMode] = useState<'gallery' | 'list'>('gallery');
  const [rowSelectedTags, setRowSelectedTags] = useState<{[key: number]: string[]}>({});
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allTags, setAllTags] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle URL parameter for site filter
  useEffect(() => {
    const siteParam = searchParams.get('site');
    if (siteParam) {
      setSelectedSite(siteParam);
    }
  }, [searchParams]);

  // Fetch assets from Supabase
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const supabaseAssets = await getAllAssets();
        setAssets(supabaseAssets);
        
        // Extract unique tags from assets
        const tagSet = new Set<string>();
        supabaseAssets.forEach((asset: any) => {
          if (asset.tags && Array.isArray(asset.tags)) {
            asset.tags.forEach((tag: string) => tagSet.add(tag));
          }
        });
        setAllTags(Array.from(tagSet).sort());
      } catch (error) {
        console.error('Error fetching assets:', error);
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const handleSelect = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedAssetIds(prev => [...prev, id]);
    } else {
      setSelectedAssetIds(prev => prev.filter(assetId => assetId !== id));
    }
  };

  const handleAssetCardClick = (asset: any) => {
    setSelectedAsset(asset);
    setShowAssetDetailModal(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      console.log('Files selected:', files);
      
      // Convert FileList to Array and process each file
      Array.from(files).forEach((file) => {
        // Generate tags from filename
        const filename = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        const generatedTags = filename
          .toLowerCase()
          .split(/[-_\s]+/) // Split by hyphens, underscores, or spaces
          .filter(word => word.length > 2) // Only include words longer than 2 characters
          .slice(0, 3); // Limit to first 3 tags
        
        // Create a mock asset object for the uploaded file
        const newAsset = {
          id: Date.now() + Math.random(), // Generate unique ID
          type: file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN',
          icon: "ImageIcon",
          name: filename,
          url: URL.createObjectURL(file), // Create blob URL for preview
          dateModified: new Date().toISOString(),
          uploadedDate: new Date().toISOString(),
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadedBy: "Current User",
          tags: generatedTags,
          fileType: "Images",
          status: "Approved",
          altText: "",
          version: "V1",
          sites: [],
          width: 0,
          height: 0,
        };
        
        // Add the new asset to the assets array using setState
        setAssets(prev => [newAsset, ...prev]);
      });
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Filter assets based on search and filters
  const filteredAssets = assets.filter((asset: any) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag: string) => asset.tags?.includes(tag));
    const matchesFileType = !selectedFileType || asset.fileType === selectedFileType;
    const matchesStatus = !selectedStatus || asset.status === selectedStatus;
    const matchesSite = !selectedSite || asset.sites?.some((site: any) => site.id === selectedSite);
    
    return matchesSearch && matchesTags && matchesFileType && matchesStatus && matchesSite;
  }).sort((a: any, b: any) => {
    const dateA = new Date(a.dateModified).getTime();
    const dateB = new Date(b.dateModified).getTime();
    return sortDesc ? dateB - dateA : dateA - dateB;
  });

  const anyFilterActive = selectedTags.length > 0 || selectedFileType || selectedStatus || selectedSite || searchQuery;

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">Assets</h1>
          {/* Hidden file input for uploads */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            multiple
            onChange={handleFileChange}
          />
          <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
            <AddIcon className="mr-2" /> Upload
          </Button>
        </div>
        <div className="mb-2">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search all assets"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4 flex flex-wrap gap-2 items-center max-h-[24px]">
          {/* Site filter - now first */}
          <button className="flex items-center gap-1 px-3 py-1 border rounded text-gray-700 bg-white hover:bg-gray-100">
            <SiteIcon className="w-4 h-4" />
            Site
            <select value={selectedSite} onChange={e => setSelectedSite(e.target.value)} className="ml-2 bg-transparent outline-none">
              <option value="">All</option>
              {allSites.map(site => (
                <option key={site.id} value={site.id}>{site.name}</option>
              ))}
            </select>
          </button>
          {/* Tag filter - now after site filter */}
          <div className="relative">
            <button type="button" className="flex items-center gap-1 px-3 py-1 border rounded text-gray-700 bg-white hover:bg-gray-100" onClick={() => setShowTagDropdown((v: boolean) => !v)}>
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M3 6a5 5 0 1 1 10 0c0 2.5-2.5 5.5-4.1 7.2a1 1 0 0 1-1.4 0C5.5 11.5 3 8.5 3 6Z" stroke="currentColor" strokeWidth="1.2"/></svg>
              {selectedTags.length === 0 ? 'Tags' : selectedTags[0]}
              <svg width="12" height="12" fill="none" viewBox="0 0 12 12"><path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.2"/></svg>
            </button>
            {showTagDropdown && (
              <div className="absolute z-10 mt-1 w-48 bg-white border rounded shadow max-h-[300px] overflow-y-auto">
                <div className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => { setSelectedTags([]); setShowTagDropdown(false); setTagSearchQuery(""); }}>All</div>
                <div className="px-2 py-1 border-b">
                  <input
                    type="text"
                    value={tagSearchQuery}
                    onChange={(e) => setTagSearchQuery(e.target.value)}
                    placeholder="Search tags..."
                    className="w-full px-2 py-1 text-sm border-none outline-none bg-transparent"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                {allTags
                  .filter(tag => tag.toLowerCase().includes(tagSearchQuery.toLowerCase()))
                  .map(tag => (
                    <div key={tag} className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => { setSelectedTags([tag]); setShowTagDropdown(false); setTagSearchQuery(""); }}>{tag}</div>
                  ))}
              </div>
            )}
          </div>
          {/* Type filter */}
          <button className="flex items-center gap-1 px-3 py-1 border rounded text-gray-700 bg-white hover:bg-gray-100">
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="3" y="5" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg>
            Type
            <select value={selectedFileType} onChange={e => setSelectedFileType(e.target.value)} className="ml-2 bg-transparent outline-none">
              <option value="">All</option>
              {allFileTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </button>
          {/* Status filter */}
          <button className="flex items-center gap-1 px-3 py-1 border rounded text-gray-700 bg-white hover:bg-gray-100">
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" fill="currentColor"/></svg>
            Status
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="ml-2 bg-transparent outline-none">
              <option value="">All</option>
              {allStatuses.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </button>
          <Button
            variant="ghost"
            className={`max-h-[24px] ${anyFilterActive ? '' : 'invisible'}`}
            disabled={!anyFilterActive}
            onClick={() => {
              setSelectedTags([]);
              setSelectedFileType("");
              setSelectedStatus("");
              setSelectedSite("");
              setSearchQuery("");
            }}
          >
            Clear
          </Button>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-[var(--text-secondary)]">
            {loading ? 'Loading assets...' : `${filteredAssets.length} assets`}
          </span>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-1 text-sm text-gray-700 hover:text-black font-medium px-2 py-1 rounded transition-colors"
              onClick={() => setSortDesc((v) => !v)}
              aria-label="Sort by date modified"
            >
              Date modified
              <span className="inline-block">
                {sortDesc ? (
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 11l-4-4h8l-4 4z" fill="currentColor"/></svg>
                ) : (
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 5l4 4H4l4-4z" fill="currentColor"/></svg>
                )}
              </span>
            </button>
            <div className="flex gap-2">
              <button
                className={`p-2 rounded ${viewMode === 'gallery' ? 'bg-gray-200' : ''}`}
                onClick={() => setViewMode('gallery')}
                aria-label="Gallery view"
              >
                <FaThLarge />
              </button>
              <button
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <FaList />
              </button>
            </div>
          </div>
        </div>
        {viewMode === 'gallery' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                id={asset.id}
                type={asset.type as string}
                icon={
                  asset.icon === 'ImageIcon' ? ImageIcon :
                  asset.icon === 'VideoIcon' ? VideoIcon :
                  asset.icon === 'MainDocsIcon' ? MainDocsIcon :
                  ImageIcon
                }
                name={asset.name}
                url={asset.url}
                isSelected={selectedAssetIds.includes(asset.id)}
                selected={selectedAssetIds.includes(asset.id)}
                onClick={() => handleAssetCardClick(asset)}
                onSelect={(checked) => handleSelect(asset.id, checked)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="flex items-center gap-4 p-4 border rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selectedAssetIds.includes(asset.id)}
                  onChange={(e) => handleSelect(asset.id, e.target.checked)}
                  className="mr-2"
                />
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    {asset.icon === 'ImageIcon' ? <ImageIcon className="w-6 h-6" /> :
                     asset.icon === 'VideoIcon' ? <VideoIcon className="w-6 h-6" /> :
                     asset.icon === 'MainDocsIcon' ? <MainDocsIcon className="w-6 h-6" /> :
                     <ImageIcon className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{asset.name}</div>
                    <div className="text-sm text-gray-500">{asset.fileSize} • {asset.uploadedBy}</div>
                  </div>
                                     <div className="flex gap-2">
                     {asset.tags?.slice(0, 2).map((tag: string, index: number) => (
                       <TagPill key={index} tag={tag} isSelected={false} />
                     ))}
                   </div>
                  <div className="text-sm text-gray-500">{asset.fileType}</div>
                  <div className="text-sm text-gray-500">{asset.status}</div>
                  <div className="text-sm text-gray-500">{new Date(asset.dateModified).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showAssetDetailModal && selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          assets={assets}
          currentIndex={assets.findIndex(a => a.id === selectedAsset.id)}
          onAssetChange={(newIndex) => {
            if (newIndex >= 0 && newIndex < assets.length) {
              setSelectedAsset(assets[newIndex]);
            }
          }}
          open={showAssetDetailModal}
          onOpenChange={setShowAssetDetailModal}
        />
      )}
      
      {/* Floating Bulk Actions Bar - Show when assets are selected */}
      {selectedAssetIds.length > 0 && (
        <div className="fixed bottom-10 z-50 p-3 bg-black text-white rounded-lg flex items-center justify-between shadow-lg" style={{ left: '472px', width: '948px', transform: 'translateX(0)' }}>
          <div className="flex items-center gap-3">
            <IconButton 
              variant="ghost" 
              size="comfortable" 
              onClick={() => setSelectedAssetIds([])}
              className="text-white hover:bg-white/20"
              aria-label="Deselect all assets"
            >
              <CloseDefaultIcon size={16} />
            </IconButton>
            <span className="text-sm font-medium text-white">
              {selectedAssetIds.length} asset{selectedAssetIds.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center gap-3">
            <IconButton 
              variant="ghost" 
              size="comfortable" 
              className="text-white hover:bg-white/20"
              aria-label="Download selected assets"
            >
              <DownloadIcon size={16} />
            </IconButton>
            <IconButton 
              variant="ghost" 
              size="comfortable" 
              className="text-white hover:bg-white/20"
              aria-label="Archive selected assets"
            >
              <ArchiveIcon size={16} />
            </IconButton>
          </div>
        </div>
      )}
    </>
  );
} 