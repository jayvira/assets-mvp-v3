import React from 'react';
import { Modal, ModalPortal, ModalOverlay } from '@/components/spring-ui/modal';
import { CloseDefaultIcon, ShareIcon } from '@/icons';
import { Badge } from '@/components/spring-ui/badge';
import { Input } from '@/components/spring-ui/input';
import { Textarea } from '@/components/spring-ui/textarea';
import { TabBar, TabBarItem } from '@/components/spring-ui/tab-bar';
import { TabNewIcon } from '@/icons/TabNewIcon';
import { IconButton } from '@/components/spring-ui/icon-button';
import { DuplicateFillIcon } from '@/icons/DuplicateFillIcon';
import { SitesStackIcon } from '@/icons/SitesStackIcon';
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
import { ChevronLargeLeftIcon } from '@/icons';
import { ChevronLargeRightIcon } from '@/icons';
import { ChevronLargeDownIcon } from '@/icons';
import { TagPill } from '@/components/TagPill';
import { Row } from '@/components/spring-ui/row';
import { DownloadIcon } from '@/icons/DownloadIcon';
import { TimeIcon } from '@/icons/TimeIcon';
import { UndoIcon } from '@/icons/UndoIcon';
import { EditIcon } from '@/icons/EditIcon';
import { UploadIcon } from '@/icons/UploadIcon';
import { AddIcon } from '@/icons/AddIcon';
import { ImageIcon } from '@/icons/ImageIcon';
import { BrushIcon } from '@/icons/BrushIcon';
import { MainDocsIcon } from '@/icons/MainDocsIcon';
import { VideoIcon } from '@/icons/VideoIcon';
import { supabase } from '@/lib/supabase';
import AssetVariantsToolbar from './AssetVariantsToolbar';
import RelatedAssetsSection from './RelatedAssetsSection';
import VersionCard from './VersionCard';
import { getSiteNameById } from '@/config/sites';
import { InsightsIcon } from '@/icons/InsightsIcon';
import { PerformanceIcon } from '@/icons/PerformanceIcon';
import { VisibleIcon } from '@/icons/VisibleIcon';
import { StarFilledIcon } from '@/icons/StarFilledIcon';

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
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [originalTags, setOriginalTags] = React.useState<string[]>([]);
  const [customTag, setCustomTag] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [selectedVariantId, setSelectedVariantId] = React.useState<string>('');
  const [asset56Data, setAsset56Data] = React.useState<any>(null);
  const [displayedImageUrl, setDisplayedImageUrl] = React.useState<string>('');
  const [showSimilarAssets, setShowSimilarAssets] = React.useState<boolean>(false);
  const [selectedVersionId, setSelectedVersionId] = React.useState<string>('');
  
  // Initialize selectedVersionId immediately when asset is available
  React.useEffect(() => {
    if (asset?.id && !selectedVersionId) {
      const currentVersionId = `current-${asset.id}`;
      console.log('Immediate initialization - Setting current version as selected:', currentVersionId);
      setSelectedVersionId(currentVersionId);
    }
  }, [asset?.id, selectedVersionId]);

  // Function to save asset changes to Supabase
  const saveAssetChanges = async (updates: any) => {
    if (!asset?.id) return;
    
    try {
      setSaving(true);
      const { error } = await supabase
        .from('Assets')
        .update(updates)
        .eq('id', asset.id);

      if (error) {
        console.error('Error saving asset changes:', error);
        // You could add a toast notification here
      } else {
        console.log('Asset changes saved successfully');
        // Update the local asset object
        Object.assign(asset, updates);
      }
    } catch (error) {
      console.error('Error saving asset changes:', error);
    } finally {
      setSaving(false);
    }
  };

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

  // Keyboard shortcut to close modal with Escape key
  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  React.useEffect(() => {
    if (asset) {
      const initialName = getFilename(asset);
      setFilename(initialName);
      setEditingFilename(initialName);
      setAltText(asset.altText || '');
      
      // Handle tags from Supabase - ensure they're properly parsed
      const assetTags = asset?.tags || [];
      console.log('Asset detail modal - Asset:', asset);
      console.log('Asset detail modal - Tags from Supabase:', assetTags);
      console.log('Asset detail modal - Tags type:', typeof assetTags);
      console.log('Asset detail modal - Tags is array:', Array.isArray(assetTags));
      
      const tagsArray = Array.isArray(assetTags) ? assetTags : [];
      setOriginalTags(tagsArray);
      setSelectedTags(tagsArray);
      
      // Set the first variant as selected by default
      if (asset.variants && asset.variants.length > 0) {
        setSelectedVariantId(asset.variants[0].id);
      } else {
        // For generated variants, always select the first one
        setSelectedVariantId('variant-1');
      }
      
      // Set the displayed image URL to the current asset's URL
      setDisplayedImageUrl(asset.url);
      
      // Set the current version as selected by default
      const currentVersionId = `current-${asset.id}`;
      console.log('Setting current version as selected:', currentVersionId);
      setSelectedVersionId(currentVersionId);
      
      // Fetch asset 56 if we're viewing asset 62
      if (asset.id === 62 && !asset56Data) {
        fetchAsset56();
      }
    }
  }, [asset, asset56Data]);
  
  // Function to fetch asset 56
  const fetchAsset56 = async () => {
    try {
      const { data, error } = await supabase
        .from('Assets')
        .select('*')
        .eq('id', 56)
        .single();
      
      if (error) {
        console.error('Error fetching asset 56:', error);
      } else {
        console.log('Asset 56 data:', data);
        setAsset56Data(data);
      }
    } catch (error) {
      console.error('Error fetching asset 56:', error);
    }
  };

  // Version selection logic
  const handleVersionSelect = (versionId: string) => {
    setSelectedVersionId(versionId);
  };

  if (!asset) return null;

  // Generate variants based on the variant_count from the database
  const generateVariants = (asset: any) => {
    if (asset.variants) return asset.variants;
    
    // Special case for asset 62 - add asset 56 as second variant
    if (asset.id === 62) {
      console.log('Asset 62 detected, asset56Data:', asset56Data);
      return [
        {
          id: 'variant-1',
          name: `${asset.name} - Original`,
          url: asset.url
        },
        {
          id: 'variant-2',
          name: `${asset.name} - Variant 1`,
          url: asset56Data?.url || 'https://placehold.co/400x400/e2e8f0/64748b?text=Asset+56', // Use asset 56 URL if available
          badge: 'Top performing'
        }
      ];
    }
    
    // Use variant_count from the database, default to 1 if not available
    const variantCount = asset.variant_count || 1;
    
    console.log(`Asset ${asset.id}: variant_count=${variantCount}`);
    
    const variants = [
      {
        id: 'variant-1',
        name: `${asset.name} - Original`,
        url: asset.url
      }
    ];
    
    // Add additional variants based on variant_count from database
    for (let i = 2; i <= variantCount; i++) {
      variants.push({
        id: `variant-${i}`,
        name: `${asset.name} - Variant ${i - 1}`,
        url: asset.url
      });
    }
    
    return variants;
  };

  const assetVariants = generateVariants(asset);

  // Function to get file type from asset
  const getFileType = (asset: any) => {
    // Use the format field from Supabase if it exists
    if (asset.format) {
      return asset.format.toUpperCase();
    }
    // Fall back to the type property if it exists (for mock assets)
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

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return '#10B981'; // Green
      case 'needs review':
        return '#F59E0B'; // Amber
      case 'needs edit':
        return '#EF4444'; // Red
      case 'in progress':
        return '#3B82F6'; // Blue
      case 'no status':
        return '#6B7280'; // Gray
      default:
        return '#6B7280'; // Gray for unknown status
    }
  };

  // Function to get file type icon based on asset format
  const getFileTypeIcon = (asset: any) => {
    const format = asset.format?.toLowerCase() || '';
    const type = asset.type?.toLowerCase() || '';
    
    // Check for images
    if (format.includes('jpg') || format.includes('jpeg') || format.includes('png') || 
        format.includes('gif') || format.includes('webp') || format.includes('bmp') ||
        format.includes('tiff') || type === 'images') {
      return ImageIcon;
    }
    
    // Check for videos
    if (format.includes('mp4') || format.includes('mov') || format.includes('avi') || 
        format.includes('wmv') || format.includes('webm') || format.includes('mkv') ||
        type === 'videos') {
      return VideoIcon;
    }
    
    // Check for vector/illustrator files
    if (format.includes('ai') || format.includes('svg') || format.includes('eps') || 
        format.includes('vector') || format.includes('illustrator')) {
      return BrushIcon;
    }
    
    // Check for documents
    if (format.includes('pdf') || format.includes('doc') || format.includes('docx') || 
        format.includes('txt') || format.includes('rtf') || format.includes('xls') ||
        format.includes('xlsx') || format.includes('ppt') || format.includes('pptx') ||
        type === 'documents') {
      return MainDocsIcon;
    }
    
    // Default to image icon for unknown types
    return ImageIcon;
  };

  // Function to check if asset is a PDF
  const isPDF = (asset: any) => {
    const format = asset.format?.toLowerCase() || '';
    const name = asset.name?.toLowerCase() || '';
    return format.includes('pdf') || name.endsWith('.pdf');
  };

  // Function to check if asset is an image
  const isImage = (asset: any) => {
    const format = asset.format?.toLowerCase() || '';
    const type = asset.type?.toLowerCase() || '';
    return format.includes('jpg') || format.includes('jpeg') || format.includes('png') || 
           format.includes('gif') || format.includes('webp') || format.includes('bmp') ||
           format.includes('tiff') || type === 'images';
  };

  // Function to get filename without extension
  const getFilename = (asset: any) => {
    if (asset.name) {
      const lastDotIndex = asset.name.lastIndexOf('.');
      return lastDotIndex > 0 ? asset.name.substring(0, lastDotIndex) : asset.name;
    }
    return asset.name || 'Unknown';
  };

  // Generate mock version history
  const generateVersionHistory = (currentAsset: any) => {
    const currentVersion = currentAsset.version || 'V3';
    const versionNumber = parseInt(currentVersion.replace('V', '')) || 3;
    
    const versions = [];
    for (let i = versionNumber; i >= 1; i--) {
      const version = {
        id: `v${i}`,
        version: `V${i}`,
        fileName: i === versionNumber ? currentAsset.name : `${currentAsset.name.replace(/\.[^/.]+$/, '')}_v${i}${currentAsset.name.match(/\.[^/.]+$/)?.[0] || ''}`,
        fileSize: i === versionNumber ? currentAsset.fileSize : `${(Math.random() * 500 + 100).toFixed(1)} KB`,
        uploadedBy: i === versionNumber ? (currentAsset.uploadedBy || 'Current User') : ['John Doe', 'Jane Smith', 'Mike Johnson'][Math.floor(Math.random() * 3)],
        uploadedDate: new Date(Date.now() - (versionNumber - i) * 24 * 60 * 60 * 1000 * Math.random() * 30).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        notes: i === versionNumber ? 'Current version' : [
          'Initial upload',
          'Fixed compression issues',
          'Updated for better quality',
          'Color correction applied',
          'Cropped to better fit layout',
          'Optimized file size'
        ][Math.floor(Math.random() * 6)],
        isCurrent: i === versionNumber,
        url: currentAsset.url // In a real app, this would be version-specific URLs
      };
      versions.push(version);
    }
    
    return versions;
  };

  // Handle version actions
  const handleRestoreVersion = async (versionId: string) => {
    console.log('Restoring version:', versionId);
    // In a real app, this would restore the version
  };

  const handleDownloadVersion = (version: any) => {
    console.log('Downloading version:', version);
    // In a real app, this would trigger download
  };

  const handleDeleteVersion = async (versionId: string) => {
    console.log('Deleting version:', versionId);
    // In a real app, this would delete the version
  };

  // Function to generate related assets based on current asset
  const generateRelatedAssets = (currentAsset: any) => {
    // Mock related assets - in a real app, this would query the database
    // based on tags, format, dimensions, or AI similarity analysis
    const mockRelatedAssets = [
      {
        id: 'similar-1',
        name: `${currentAsset.name?.split('.')[0] || 'Asset'}_variant_01.${currentAsset.format?.toLowerCase() || 'jpg'}`,
        url: currentAsset.url || 'https://placehold.co/400x400/e2e8f0/64748b?text=Similar+1',
        fileSize: '2.4 MB',
        format: currentAsset.format || 'JPG',
        similarity: 89
      },
      {
        id: 'similar-2',
        name: `${currentAsset.name?.split('.')[0] || 'Asset'}_alternative.${currentAsset.format?.toLowerCase() || 'jpg'}`,
        url: currentAsset.url || 'https://placehold.co/400x400/e2e8f0/64748b?text=Similar+2',
        fileSize: '1.8 MB',
        format: currentAsset.format || 'JPG',
        similarity: 76
      },
      {
        id: 'similar-3',
        name: `${currentAsset.name?.split('.')[0] || 'Asset'}_related.${currentAsset.format?.toLowerCase() || 'jpg'}`,
        url: currentAsset.url || 'https://placehold.co/400x400/e2e8f0/64748b?text=Similar+3',
        fileSize: '3.1 MB',
        format: currentAsset.format || 'JPG',
        similarity: 65
      }
    ];

    return mockRelatedAssets;
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
                  const fileExtension = asset.format ? asset.format.toLowerCase() : getFileType(asset).toLowerCase();
                  const newName = editingFilename + '.' + fileExtension;
                  asset.name = newName;
                  saveAssetChanges({ name: newName });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setFilename(editingFilename);
                    const fileExtension = asset.format ? asset.format.toLowerCase() : getFileType(asset).toLowerCase();
                    const newName = editingFilename + '.' + fileExtension;
                    asset.name = newName;
                    saveAssetChanges({ name: newName });
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
                    saveAssetChanges({ altText });
                  }
                }}
                className="text-sm"
                placeholder="Enter alt text for accessibility..."
              />
            </div>
            <div>
              <h3 className="text-black/60 mb-1">Uploaded</h3>
              <p className="text-sm text-gray-900">
                {asset.uploadedDate ? new Date(asset.uploadedDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                }) : 'Unknown'}
                {asset.uploadedBy ? ` by ${asset.uploadedBy}` : ''}
              </p>
            </div>
            <div>
              <h3 className="text-black/60 mb-1">Last modified</h3>
              <p className="text-sm text-gray-900">
                {asset.dateModified ? new Date(asset.dateModified).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                }) : 'Unknown'}
                {asset.uploadedBy ? ` by ${asset.uploadedBy}` : ''}
              </p>
            </div>

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
                          const newTags = [...selectedTags, customTag.trim()];
                          setSelectedTags(newTags);
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
                  <SitesStackIcon className="w-4 h-4 text-gray-400" />
                {originalTags.length > 0 ? (
                  originalTags.map((tag: string) => (
                    <TagPill
                      key={tag}
                      tag={tag}
                      isSelected={selectedTags.includes(tag)}
                      onClick={() => {
                        const isSelected = selectedTags.includes(tag);
                        let newTags;
                        if (isSelected) {
                          newTags = selectedTags.filter(t => t !== tag);
                        } else {
                          newTags = [...selectedTags, tag];
                        }
                        setSelectedTags(newTags);
                      }}
                    />
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No tags added yet</span>
                )}
                {/* Show newly added tags that aren't in the original tags */}
                {selectedTags.filter(tag => !originalTags.includes(tag)).map((tag: string) => (
                  <TagPill
                    key={tag}
                    tag={tag}
                    isSelected={true}
                    onClick={() => {
                      const newTags = selectedTags.filter(t => t !== tag);
                      setSelectedTags(newTags);
                    }}
                  />
                ))}
              </div>
            </>
          </div>
        );
      case 'site-usage':
        return (
          <div className="space-y-6 overflow-y-auto h-full w-full">
            {/* Custom Variant B Card for Asset 62 - Moved to top */}
            {asset.id === 62 && (
              <div>
                <h3 className="text-black/60 mb-3 font-medium">Variant Performance</h3>
                <div className="p-3 rounded-lg border" style={{ 
                  background: 'linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%)',
                  borderColor: '#259D4D',
                  backgroundColor: 'rgba(37, 157, 77, 0.05)'
                }}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-start justify-center">
                        <StarFilledIcon className="w-4 h-4" style={{ color: '#259D4D' }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#259D4D' }}>Variant B</p>
                        <p className="text-xs" style={{ color: '#259D4D' }}>+18% CTR improvement</p>
                      </div>
                    </div>
                    <Button variant="default" size="compact" style={{ backgroundColor: 'rgba(37, 157, 77, 0.2)', color: '#259D4D' }}>
                      Promote
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Analytics Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Performance Score</p>
                    <p className="text-2xl font-bold text-gray-900">92%</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">Optimized for web</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Load Time</p>
                    <p className="text-2xl font-bold text-gray-900">0.8s</p>
                  </div>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">⚡</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">Fast loading</p>
              </div>
            </div>

            {/* Site Relationships */}
            <div>
              <h3 className="text-black/60 mb-3 font-medium">Site Relationships</h3>
              <div className="space-y-3">
                {asset.sites && asset.sites.length > 0 ? (
                  asset.sites.map((site: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <span className="text-sm font-medium text-gray-900">{getSiteNameById(site.id)}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{site.pages || Math.floor(Math.random() * 15) + 1} pages</span>
                            <span className="text-xs text-gray-300">•</span>
                            <span className="text-xs text-gray-500">{site.components || Math.floor(Math.random() * 8) + 1} components</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Active</span>
                        <IconButton variant="ghost" size="compact" aria-label="View site">
                          <TabNewIcon className="w-4 h-4 text-blue-600" />
                        </IconButton>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-gray-400 text-xl">📁</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">No sites associated</p>
                    <p className="text-xs text-gray-400">This asset isn't used in any sites yet</p>
                  </div>
                )}
              </div>
            </div>






          </div>
        );
      case 'versions':
        const versionHistory = generateVersionHistory(asset);
        return (
          <div className="space-y-6">
            {/* Current Version */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-black/60">Current Version</h3>
                <IconButton
                  variant="ghost"
                  size="compact"
                  aria-label="Add new version"
                >
                  <AddIcon size={16} />
                </IconButton>
              </div>
              <VersionCard
                id={`current-${asset.id}`}
                version="V3"
                fileName={asset.name || 'Asset'}
                fileSize={asset.fileSize || 'Unknown size'}
                uploadedBy={asset.uploadedBy || 'Current User'}
                uploadedDate={asset.uploadedDate 
                  ? new Date(asset.uploadedDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })
                  : new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })
                }
                notes="Current version"
                url={asset.url}
                isCurrent={true}
                showCurrentBadge={false}
                isSelected={selectedVersionId === `current-${asset.id}`}
                onSelect={() => handleVersionSelect(`current-${asset.id}`)}
              />
            </div>

            {/* Older Versions */}
            <div>
              <h3 className="text-black/60 mb-3">Older versions</h3>
              <div className="space-y-3">
                {/* Always show at least 2 mock previous versions for demonstration */}
                <VersionCard
                  id="v2-demo"
                  version="V2"
                  fileName={asset.name || 'Asset'}
                  fileSize="2.1 MB"
                  uploadedBy="Jane Smith"
                  uploadedDate="Jan 15, 2025"
                  notes="Updated color correction and brightness"
                  url={asset.url}
                  isCurrent={false}
                  isSelected={selectedVersionId === "v2-demo"}
                  onSelect={() => handleVersionSelect("v2-demo")}
                  onClick={() => {
                    console.log('Selected version: V2');
                  }}
                />
                <VersionCard
                  id="v1-demo"
                  version="V1"
                  fileName={asset.name || 'Asset'}
                  fileSize="2.8 MB"
                  uploadedBy="John Doe"
                  uploadedDate="Dec 20, 2024"
                  notes="Initial upload"
                  url={asset.url}
                  isCurrent={false}
                  isSelected={selectedVersionId === "v1-demo"}
                  onSelect={() => handleVersionSelect("v1-demo")}
                  onClick={() => {
                    console.log('Selected version: V1');
                  }}
                />
              </div>
            </div>

            {/* Version Comparison */}
            {versionHistory.length > 1 && (
              <div>
                <h3 className="text-black/60 mb-3">Compare Versions</h3>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">From</label>
                    <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded">
                      {versionHistory.map((version) => (
                        <option key={version.id} value={version.id}>
                          {version.version}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">To</label>
                    <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded">
                      {versionHistory.map((version) => (
                        <option key={version.id} value={version.id}>
                          {version.version}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button variant="outline" size="compact" className="w-full mt-2">
                  Compare Versions
                </Button>
              </div>
            )}
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
              {React.createElement(getFileTypeIcon(asset), { 
                size: 20, 
                className: "text-gray-600 flex-shrink-0" 
              })}
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
              <IconButton variant="outline" aria-label="Share">
                <ShareIcon size={16} />
              </IconButton>
                              <Button variant="outline">
                  <SitesStackIcon size={16} className="mr-1" />
                  Edit
                </Button>
              <Button variant="primary">Download</Button>
              <IconButton variant="ghost" aria-label="Close" onClick={() => onOpenChange(false)}>
                <CloseDefaultIcon size={20} />
              </IconButton>
            </div>
          </div>
          
          {/* Modal Content */}
          <div className="flex-1 flex flex-col">
            
            <div className="flex flex-1">
              {/* Asset Variants Toolbar - Hidden for now, keeping code for future use
              <AssetVariantsToolbar
                variants={assetVariants}
                selectedVariantId={selectedVariantId}
                onVariantSelect={(variantId) => {
                  setSelectedVariantId(variantId);
                  
                  // Special handling for asset 62's second variant (asset 56)
                  if (asset.id === 62 && variantId === 'variant-2' && asset56Data) {
                    // Switch to showing asset 56's image
                    console.log('Switching to asset 56 image:', asset56Data.url);
                    setDisplayedImageUrl(asset56Data.url);
                  } else if (asset.id === 62 && variantId === 'variant-1') {
                    // Switch back to asset 62's original image
                    console.log('Switching back to asset 62 image:', asset.url);
                    setDisplayedImageUrl(asset.url);
                  }
                }}
                onAddVariant={() => {
                  console.log('Add variant clicked');
                  // Handle adding new variant
                }}
              />
              */}
              
              {/* Center Column - Large Image */}
              <div className="flex-1 flex flex-col items-center justify-center relative">
                {/* Related Assets Section - Positioned relative to asset focus view */}
                <RelatedAssetsSection
                  relatedAssets={generateRelatedAssets(asset)}
                  isExpanded={showSimilarAssets}
                  onToggleExpanded={() => setShowSimilarAssets(!showSimilarAssets)}
                />
                <div 
                  className="asset-image-wrapper flex items-center justify-center overflow-hidden px-10 h-full w-full flex-1"
                  style={isPDF(asset) ? {} : {
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
                  {isPDF(asset) ? (
                    <iframe
                      src={displayedImageUrl || asset.url}
                      title={asset.name}
                      className="w-full h-full border-0 rounded-lg shadow-lg"
                      style={{ 
                        width: 'calc(100% - 80px)', 
                        height: 'calc(100vh - 200px)',
                        minHeight: '600px'
                      }}
                      onError={() => {
                        console.error('PDF failed to load in iframe');
                      }}
                    />
                  ) : (
                    <img 
                      src={displayedImageUrl || asset.url}
                      alt={asset.name}
                      className="object-contain w-auto h-auto"
                      style={{ maxWidth: 'calc(100% - 80px)', maxHeight: 'calc(100vh - 200px)' }}
                    />
                  )}
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
                  <TabBarItem value="site-usage" className="px-2">Insights</TabBarItem>
                  <TabBarItem value="versions" className="px-2">
                    Versions
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