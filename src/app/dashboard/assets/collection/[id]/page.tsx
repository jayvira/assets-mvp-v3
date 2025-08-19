"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import AssetCard from "@/components/designer/layout/panels/leftpanel/AssetCard";
import { ImageIcon, VideoIcon, MainDocsIcon } from "@/icons";
import AssetDetailModal from "@/components/designer/layout/panels/leftpanel/AssetDetailModal";
import { UploadProgressBanner } from "@/components/designer/layout/panels/leftpanel/UploadProgressBanner";
import { Button } from '@/components/spring-ui/button';
import { IconButton } from '@/components/spring-ui/icon-button';
import { Filter } from '@/components/spring-ui/filter';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from '@/components/spring-ui/dropdown-menu';
import { SegmentedControl, SegmentedControlItem } from '@/components/spring-ui/segmented-control';
import { AddIcon } from '@/icons/AddIcon';
import { TagPill } from '@/components/TagPill';
import { CloseDefaultIcon, DownloadIcon, ArchiveIcon, SearchDefaultIcon, ArrowLeftIcon, GridIcon, ListIcon, ArrowDownIcon, ChevronSmallDownIcon, ChevronSmallRightIcon, MoreIcon } from '@/icons';
import { getSiteNameById } from '@/config/sites';
import { getAllAssets } from '@/lib/supabase';
import { Input } from '@/components/spring-ui/input';
import FolderCard from '@/components/dashboard/folder-card';

const allFileTypes = ["Images", "Videos", "Documents", "Illustrator & Vector Graphics"];

const exampleFolders = [
  { id: '1', name: 'Stock images', itemCount: 24 },
  { id: '2', name: 'Background patterns', itemCount: 24 },
  { id: '3', name: 'Icons', itemCount: 24 },
  { id: '4', name: 'People', itemCount: 24 },
];

// Helper function to parse file size strings to bytes
const parseFileSizeToBytes = (fileSize: string): number => {
  if (!fileSize) return 0;
  
  const size = parseFloat(fileSize);
  if (fileSize.includes('KB')) return size * 1024;
  if (fileSize.includes('MB')) return size * 1024 * 1024;
  if (fileSize.includes('GB')) return size * 1024 * 1024 * 1024;
  
  return size; // Assume bytes if no unit specified
};

function CollectionContent() {
  const params = useParams();
  const router = useRouter();
  const collectionId = params.id as string;
  const [selectedAssetIds, setSelectedAssetIds] = useState<number[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [showAssetDetailModal, setShowAssetDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFileType, setSelectedFileType] = useState<string[]>([]);
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [sortCriteria, setSortCriteria] = useState<string>('Date uploaded');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'gallery' | 'list'>('gallery');
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [archivedAssetIds, setArchivedAssetIds] = useState<number[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadBanner, setShowUploadBanner] = useState(false);
  const [uploadingFileName, setUploadingFileName] = useState('');
  const [isAssetsCollapsed, setIsAssetsCollapsed] = useState(false);
  const [isFoldersCollapsed, setIsFoldersCollapsed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch assets from Supabase
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const supabaseAssets = await getAllAssets();
        // Filter assets for this collection
        const collectionAssets = supabaseAssets.filter((asset: any) => 
          asset.sites?.some((site: any) => site.id === collectionId)
        );
        setAssets(collectionAssets);
        
        // Extract unique tags from assets
        const tagSet = new Set<string>();
        collectionAssets.forEach((asset: any) => {
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
  }, [collectionId]);

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
      
      // Show upload banner and start progress simulation
      setShowUploadBanner(true);
      setUploadProgress(0);
      setUploadingFileName(files.length === 1 ? files[0].name : `${files.length} files`);
      
      // Simulate upload progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 15 + 5; // Random progress increment
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);
          
          // Hide banner after a short delay
          setTimeout(() => {
            setShowUploadBanner(false);
            setUploadProgress(0);
          }, 1000);
        }
        setUploadProgress(Math.min(progress, 100));
      }, 200);
      
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
          sites: [{ id: collectionId }],
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

  const handleArchiveSelected = () => {
    // Add selected asset IDs to the archived list
    setArchivedAssetIds(prev => [...prev, ...selectedAssetIds]);
    // Clear the selection
    setSelectedAssetIds([]);
  };

  // Filter assets based on search and filters, excluding archived assets
  const filteredAssets = assets.filter((asset: any) => {
    // Exclude archived assets
    if (archivedAssetIds.includes(asset.id)) {
      return false;
    }
    
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag: string) => asset.tags?.includes(tag));
    const matchesFileType = selectedFileType.length === 0 || selectedFileType.some((type: string) => asset.fileType === type);
    
    return matchesSearch && matchesTags && matchesFileType;
  });

  const anyFilterActive = selectedTags.length > 0 || selectedFileType.length > 0 || searchQuery;

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <IconButton
                variant="ghost"
                size="comfortable"
                onClick={() => router.push('/dashboard/assets/collections')}
              >
                <ArrowLeftIcon size={16} />
              </IconButton>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => router.push('/dashboard/assets/collections')}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-xl"
                >
                  Collections
                </button>
                <span className="text-[var(--text-secondary)] text-xl">/</span>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--text-primary)] text-xl font-medium">{getSiteNameById(collectionId)}</span>
                  <IconButton
                    variant="ghost"
                    size="comfortable"
                    onClick={() => console.log('More options clicked')}
                  >
                    <MoreIcon size={16} className="text-[var(--text-secondary)]" />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <SearchDefaultIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-4 h-4" />
              <input
                type="text"
                placeholder="Search collection assets"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* Hidden file input for uploads */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              multiple
              accept="*/*"
              onChange={handleFileChange}
            />
            <Button 
              variant="outline" 
              onClick={() => console.log('Share clicked')}
            >
              Share
            </Button>
            <Button 
              variant="primary" 
              onClick={() => fileInputRef.current?.click()}
            >
              <AddIcon className="mr-2" /> Add
            </Button>
          </div>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
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
                      showSearchIcon
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                  {allTags
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
            {/* Type filter */}
            <Filter 
              variant="default" 
              size="compact" 
              state={selectedFileType.length > 0 ? "filled" : "empty"}
              onClear={() => setSelectedFileType([])}
              dropdownContent={
                <>
                  {allFileTypes.map(type => (
                    <DropdownMenuCheckboxItem 
                      key={type} 
                      checked={selectedFileType.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedFileType(prev => [...prev, type]);
                        } else {
                          setSelectedFileType(prev => prev.filter(t => t !== type));
                        }
                      }}
                    >
                      {type}
                    </DropdownMenuCheckboxItem>
                  ))}
                </>
              }
              ariaLabel="Type options"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="3" y="5" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg>
              {selectedFileType.length === 0 ? 'File type' : selectedFileType.join(', ')}
            </Filter>
            {/* Clear filters button */}
            <Button
              variant="ghost"
              className={`max-h-[24px] ${anyFilterActive ? '' : 'invisible'}`}
              disabled={!anyFilterActive}
              onClick={() => {
                setSelectedTags([]);
                setSelectedFileType([]);
                setSearchQuery("");
              }}
            >
              Clear
            </Button>
          </div>

          <div className="flex items-center gap-4">
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

        <div className="h-6" />

        <button
          className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
          onClick={() => setIsFoldersCollapsed(!isFoldersCollapsed)}
        >
          <h2 className="label-text text-[var(--text-primary)] flex items-center gap-2">
            <span className="font-medium">Folders</span>
            <span>{exampleFolders.length}</span>
          </h2>
          {isFoldersCollapsed ? (
            <ChevronSmallRightIcon size={20} className="text-[var(--text-secondary)]" />
          ) : (
            <ChevronSmallDownIcon size={20} className="text-[var(--text-secondary)]" />
          )}
        </button>

        {!isFoldersCollapsed && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {exampleFolders.map((folder) => (
              <FolderCard
                key={folder.id}
                name={folder.name}
                itemCount={folder.itemCount}
                onClick={() => console.log('Folder clicked:', folder.name)}
                onMoreClick={() => console.log('More clicked:', folder.name)}
              />
            ))}
          </div>
        )}

        <button 
          className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
          onClick={() => setIsAssetsCollapsed(!isAssetsCollapsed)}
        >
          <h2 className="label-text text-[var(--text-primary)] flex items-center gap-2">
            <span className="font-medium">Assets</span>
            <span>{filteredAssets.length}</span>
          </h2>
          {isAssetsCollapsed ? (
            <ChevronSmallRightIcon size={20} className="text-[var(--text-secondary)]" />
          ) : (
            <ChevronSmallDownIcon size={20} className="text-[var(--text-secondary)]" />
          )}
        </button>

        {!isAssetsCollapsed && viewMode === 'gallery' ? (
          loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-[var(--text-primary)]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredAssets.map((asset) => (
                <AssetCard
                  key={asset.id}
                  id={asset.id}
                  type={asset.type as string}
                  format={asset.format}
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
          )
        ) : !isAssetsCollapsed ? (
          loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-[var(--text-primary)]"></div>
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
                  </div>
                </div>
              ))}
            </div>
          )
        ) : null
        }
      </div>

      {showAssetDetailModal && selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          assets={filteredAssets}
          currentIndex={filteredAssets.findIndex(a => a.id === selectedAsset.id)}
          onAssetChange={(newIndex) => {
            if (newIndex >= 0 && newIndex < filteredAssets.length) {
              setSelectedAsset(filteredAssets[newIndex]);
            }
          }}
          open={showAssetDetailModal}
          onOpenChange={setShowAssetDetailModal}
        />
      )}
      
      {/* Upload Progress Banner */}
      <UploadProgressBanner
        isVisible={showUploadBanner}
        progress={uploadProgress}
        fileName={uploadingFileName}
        onClose={() => setShowUploadBanner(false)}
      />
      
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
              onClick={handleArchiveSelected}
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

export default function CollectionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CollectionContent />
    </Suspense>
  );
}