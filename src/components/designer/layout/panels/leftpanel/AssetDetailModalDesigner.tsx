"use client";

import React, { useState } from 'react';
import { Modal, ModalPortal, ModalOverlay } from '@/components/spring-ui/modal';
import { CloseDefaultIcon, CheckDefaultIcon } from '@/icons';
import { Badge } from '@/components/spring-ui/badge';
import { Input } from '@/components/spring-ui/input';
import { Textarea } from '@/components/spring-ui/textarea';
import { TabBar, TabBarItem } from '@/components/spring-ui/tab-bar';
import { TabNewIcon } from '@/icons/TabNewIcon';
import { IconButton } from '@/components/spring-ui/icon-button';
import { DuplicateFillIcon } from '@/icons/DuplicateFillIcon';
import { LinkIcon } from '@/icons/LinkIcon';
import { AISparkleIcon } from '@/icons/AISparkleIcon';
import { BuyIcon } from '@/icons/BuyIcon';
import { Button } from '@/components/spring-ui/button';
import { SplitButton } from '@/components/spring-ui/split-button';
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
import { RedoIcon } from '@/icons/RedoIcon';
import { CropIcon } from '@/icons/CropIcon';
import { EditIcon } from '@/icons/EditIcon';
import { UploadIcon } from '@/icons/UploadIcon';
import { AddIcon } from '@/icons/AddIcon';
import { FillIcon } from '@/icons/FillIcon';
import { FilterSmallContrastIcon } from '@/icons/FilterSmallContrastIcon';
import { FilterSmallInteractionIcon } from '@/icons/FilterSmallInteractionIcon';
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
import { ArrowLeftIcon } from '@/icons/ArrowLeftIcon';

interface AssetDetailModalDesignerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: any;
  isNested?: boolean;
}

const AssetDetailModalDesigner: React.FC<AssetDetailModalDesignerProps> = ({ open, onOpenChange, asset, isNested = false }) => {
  console.log('AssetDetailModalDesigner render - open:', open, 'asset:', asset);
  
  const [filename, setFilename] = useState('');
  const [editingFilename, setEditingFilename] = useState('');
  const [altText, setAltText] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [originalTags, setOriginalTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [displayedImageUrl, setDisplayedImageUrl] = useState<string>('');
  const [showSimilarAssets, setShowSimilarAssets] = useState<boolean>(false);
  const [selectedVersionId, setSelectedVersionId] = useState<string>('');
  const [isImageEditModalOpen, setIsImageEditModalOpen] = useState<boolean>(false);

  // Initialize data when asset changes
  React.useEffect(() => {
    if (asset) {
      console.log('AssetDetailModalDesigner received asset data:', asset);
      console.log('Asset altText:', asset.altText);
      
      const initialName = getFilename(asset);
      setFilename(initialName);
      setEditingFilename(initialName);
      
      const initialAltText = asset.altText || '';
      setAltText(initialAltText);
      console.log('Set altText state to:', initialAltText);
      
      const assetTags = asset?.tags || [];
      const tagsArray = Array.isArray(assetTags) ? assetTags : [];
      setOriginalTags(tagsArray);
      setSelectedTags(tagsArray);
      
      if (asset.variants && asset.variants.length > 0) {
        setSelectedVariantId(asset.variants[0].id);
      } else {
        setSelectedVersionId('variant-1');
      }
      
      setDisplayedImageUrl(asset.url);
      const currentVersionId = `current-${asset.id}`;
      setSelectedVersionId(currentVersionId);
    }
  }, [asset]);

  // Function to save asset changes to Supabase
  const saveAssetChanges = async (updates: any) => {
    if (!asset?.id) return;
    
    try {
      setSaving(true);
      console.log('Saving asset changes to Supabase:', updates);
      
      const { error } = await supabase
        .from('Assets')
        .update(updates)
        .eq('id', asset.id);

      if (error) {
        console.error('Error saving asset changes:', error);
      } else {
        console.log('Asset changes saved successfully to Supabase');
        // Update the local asset object with the new values
        Object.assign(asset, updates);
        console.log('Updated local asset object:', asset);
      }
    } catch (error) {
      console.error('Error saving asset changes:', error);
    } finally {
      setSaving(false);
    }
  };

  // Function to get file type from asset
  const getFileType = (asset: any) => {
    if (asset.fileType) {
      return asset.fileType.toUpperCase();
    }
    if (asset.type && asset.type !== 'images' && asset.type !== 'videos' && asset.type !== 'documents') {
      return asset.type;
    }
    if (asset.name) {
      const extension = asset.name.split('.').pop()?.toUpperCase();
      return extension || 'Unknown';
    }
    return 'Unknown';
  };

  // Function to get file type icon based on asset format
  const getFileTypeIcon = (asset: any) => {
    const fileType = asset.fileType?.toLowerCase() || '';
    const type = asset.type?.toLowerCase() || '';
    
    if (fileType.includes('jpg') || fileType.includes('jpeg') || fileType.includes('png') || 
        fileType.includes('gif') || fileType.includes('webp') || fileType.includes('bmp') ||
        fileType.includes('tiff') || type === 'images') {
      return ImageIcon;
    }
    
    if (fileType.includes('mp4') || fileType.includes('mov') || fileType.includes('avi') || 
        fileType.includes('wmv') || fileType.includes('webm') || fileType.includes('mkv') ||
        type === 'videos') {
      return VideoIcon;
    }
    
    if (fileType.includes('ai') || fileType.includes('svg') || fileType.includes('eps') || 
        fileType.includes('vector') || fileType.includes('illustrator')) {
      return BrushIcon;
    }
    
    if (fileType.includes('pdf') || fileType.includes('doc') || fileType.includes('docx') || 
        fileType.includes('txt') || fileType.includes('rtf') || fileType.includes('xls') ||
        fileType.includes('xlsx') || fileType.includes('ppt') || fileType.includes('pptx') ||
        type === 'documents') {
      return MainDocsIcon;
    }
    
    return ImageIcon;
  };

  // Function to get filename without extension
  const getFilename = (asset: any) => {
    if (asset.name) {
      const lastDotIndex = asset.name.lastIndexOf('.');
      return lastDotIndex > 0 ? asset.name.substring(0, lastDotIndex) : asset.name;
    }
    return asset.name || 'Unknown';
  };

  // Function to check if asset is a PDF
  const isPDF = (asset: any) => {
    const fileType = asset.fileType?.toLowerCase() || '';
    const name = asset.name?.toLowerCase() || '';
    return fileType.includes('pdf') || name.endsWith('.pdf');
  };

  // Function to check if asset is a document or PDF
  const isDocumentOrPDF = (asset: any) => {
    const fileType = asset.fileType?.toLowerCase() || '';
    const type = asset.type?.toLowerCase() || '';
    const name = asset.name?.toLowerCase() || '';
    
    if (fileType.includes('pdf') || name.endsWith('.pdf')) return true;
    if (type === 'documents') return true;
    
    const documentFormats = ['doc', 'docx', 'txt', 'rtf', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp'];
    if (documentFormats.some(docFormat => fileType.includes(docFormat) || name.endsWith(`.${docFormat}`))) return true;
    
    return false;
  };

  // Version selection logic
  const handleVersionSelect = (versionId: string) => {
    setSelectedVersionId(versionId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <div
                  contentEditable
                  suppressContentEditableWarning
                  className="text-lg font-semibold text-[var(--text-primary)] outline-none border-b-2 border-transparent hover:border-[var(--border-default)] focus:border-[var(--purple-400)] transition-colors cursor-text min-h-[32px] flex items-center flex-1"
                  onInput={(e) => setEditingFilename(e.currentTarget.textContent || '')}
                  onBlur={() => {
                    if (editingFilename.trim()) {
                      setFilename(editingFilename);
                      const fileExtension = asset.fileType ? asset.fileType.toLowerCase() : getFileType(asset).toLowerCase();
                      const newName = editingFilename + '.' + fileExtension;
                      asset.name = newName;
                      saveAssetChanges({ name: newName });
                    } else {
                      setEditingFilename(filename);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.currentTarget.blur();
                    }
                  }}
                >
                  {editingFilename}
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-[var(--text-primary)]">{getFileType(asset)}</span>
                <span className="text-sm text-[var(--text-secondary)]">•</span>
                <span className="text-sm text-[var(--text-primary)]">{asset.fileSize}</span>
                <span className="text-sm text-[var(--text-secondary)]">•</span>
                <span className="text-sm text-[var(--text-primary)]">{asset.width && asset.height ? `${asset.width} × ${asset.height}` : ''}</span>
              </div>
            </div>
            <hr className="border-t border-[var(--border-default)] mt-2 mb-6" />
            <div>
              <h3 className="section-label mb-1">Alt Text</h3>
              <div className="relative">
                <Textarea
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  onBlur={() => {
                    const trimmedAltText = altText.trim();
                    const currentAltText = asset.altText || '';
                    if (trimmedAltText !== currentAltText) {
                      console.log('Saving alt text change:', { old: currentAltText, new: trimmedAltText });
                      // Update the local asset object first
                      asset.altText = trimmedAltText;
                      // Save to Supabase
                      saveAssetChanges({ altText: trimmedAltText });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.currentTarget.blur();
                    }
                  }}
                  className="text-sm"
                  placeholder="Enter alt text for accessibility..."
                />
                {saving && (
                  <div className="absolute right-2 top-2 text-xs text-[var(--text-secondary)]">
                    Saving...
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="section-label mb-3">Tags</h3>
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
                        // Save new tags to Supabase
                        saveAssetChanges({ tags: newTags });
                      }
                      setCustomTag('');
                    }
                  }}
                  placeholder="Add tags"
                  className="flex-1 shadow-none"
                />
              </div>
              <div className="flex flex-wrap items-start gap-2 min-h-[24px]">
                <AISparkleIcon className="w-4 h-4 text-gray-400 mt-0.5" />
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
                        // Save tag changes to Supabase
                        saveAssetChanges({ tags: newTags });
                      }}
                    />
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No tags added yet</span>
                )}
                {selectedTags.filter(tag => !originalTags.includes(tag)).map((tag: string) => (
                  <TagPill
                    key={tag}
                    tag={tag}
                    isSelected={true}
                    onClick={() => {
                      const newTags = selectedTags.filter(t => t !== tag);
                      setSelectedTags(newTags);
                      // Save tag changes to Supabase
                      saveAssetChanges({ tags: newTags });
                    }}
                  />
                ))}
              </div>
            </div>
            <hr className="border-t border-gray-200 mt-2 mb-6" />
            <div>
              <h3 className="section-label mb-3">File Info</h3>
              <div className="mb-4">
                <h3 className="text-[var(--text-secondary)] mb-1">Original File Name</h3>
                <p className="text-sm text-[var(--text-primary)]">
                  {asset.name || 'Unknown'}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-[var(--text-secondary)] mb-1">Uploaded</h3>
                <p className="text-sm text-[var(--text-primary)]">
                  {asset.uploadedDate ? new Date(asset.uploadedDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  }) : 'Unknown'}
                  {asset.uploadedBy ? ` by ${asset.uploadedBy}` : ''}
                </p>
              </div>
              <div>
                <h3 className="text-[var(--text-secondary)] mb-1">Last modified</h3>
                <p className="text-sm text-[var(--text-primary)]">
                  {asset.dateModified ? new Date(asset.dateModified).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  }) : 'Unknown'}
                  {asset.uploadedBy ? ` by ${asset.uploadedBy}` : ''}
                </p>
              </div>
            </div>
          </div>
        );
      case 'insights':
        return (
          <div className="space-y-6 overflow-y-auto h-full w-full">
            {/* Custom Variant B Card for Asset 62 - Moved to top */}
            {asset.id === 62 && (
              <div>
                <h3 className="text-[var(--text-secondary)] mb-3 font-medium">Variant Performance</h3>
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
              <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg border border-[var(--border-default)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">Performance Score</p>
                    <p className="text-2xl font-bold text-[var(--text-primary)]">92%</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-2">Optimized for web</p>
              </div>
              
              <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg border border-[var(--border-default)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">Load Time</p>
                    <p className="text-2xl font-bold text-[var(--text-primary)]">0.8s</p>
                  </div>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">⚡</span>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-2">Fast loading</p>
              </div>
            </div>

            {/* Site Relationships */}
            <div>
              <h3 className="text-[var(--text-secondary)] mb-3 font-medium">Site Relationships</h3>
              <div className="space-y-3">
                {asset.sites && asset.sites.length > 0 ? (
                  asset.sites.map((site: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-default)]">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <span className="text-sm font-medium text-[var(--text-primary)]">{getSiteNameById(site.id)}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-[var(--text-secondary)]">{site.pages || Math.floor(Math.random() * 15) + 1} pages</span>
                            <span className="text-xs text-[var(--text-secondary)]">•</span>
                            <span className="text-xs text-[var(--text-secondary)]">{site.components || Math.floor(Math.random() * 8) + 1} components</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Active</span>
                        <IconButton 
                          variant="ghost" 
                          size="compact" 
                          aria-label="View site"
                          onClick={() => window.open('/', '_blank')}
                        >
                          <TabNewIcon className="w-4 h-4 text-blue-600" />
                        </IconButton>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-[var(--text-secondary)] text-xl">📁</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-1">No sites associated</p>
                    <p className="text-xs text-[var(--text-secondary)]">This asset isn't used in any sites yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'activity':
        return (
          <div className="space-y-6">
            {/* Version History Label */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[var(--text-secondary)] font-medium">Version history</h3>
              <IconButton
                variant="ghost"
                size="compact"
                aria-label="Add new version"
              >
                <AddIcon size={16} />
              </IconButton>
            </div>
            
            {/* Current Version */}
            <div>
              <div className="flex flex-col mb-3">
                <h3 className="text-[var(--text-secondary)] mb-2">Current Version</h3>
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
            </div>

            {/* Older Versions */}
            <div>
              <h3 className="text-[var(--text-secondary)] mb-3">Older versions</h3>
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
            <div>
              <h3 className="text-[var(--text-secondary)] mb-3">Compare Versions</h3>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs text-[var(--text-secondary)] mb-1">From</label>
                  <select className="w-full px-2 py-1 text-sm border border-[var(--border-default)] rounded bg-[var(--bg-primary)] text-[var(--text-primary)]">
                    <option value="v1">V1</option>
                    <option value="v2">V2</option>
                    <option value="v3">V3</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-[var(--text-secondary)] mb-1">To</label>
                  <select className="w-full px-2 py-1 text-sm border border-[var(--border-default)] rounded bg-[var(--bg-primary)] text-[var(--text-primary)]">
                    <option value="v1">V1</option>
                    <option value="v2">V2</option>
                    <option value="v3">V3</option>
                  </select>
                </div>
              </div>
              <Button variant="outline" size="compact" className="w-full mt-2">
                Compare Versions
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!asset) return null;

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalPortal>
        {!isNested && <ModalOverlay />}
        <div 
          className="fixed left-[50%] top-[50%] z-[9999] w-[1000px] h-[700px] translate-x-[-50%] translate-y-[-50%] bg-[var(--bg-primary)] shadow-[var(--shadow-menu-elevated)] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 flex flex-col p-0 overflow-hidden rounded-xl"
          style={{ borderRadius: '12px' }}
        >
          {/* Custom Modal Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-default)] bg-[var(--bg-primary)]">
            <div className="flex items-center gap-3">
              {isNested && (
                <IconButton
                  variant="ghost"
                  size="comfortable"
                  onClick={() => onOpenChange(false)}
                  className="mr-2"
                  aria-label="Go back"
                >
                  <ArrowLeftIcon size={16} />
                </IconButton>
              )}
              {React.createElement(getFileTypeIcon(asset), { 
                size: 20, 
                className: "text-[var(--text-secondary)] flex-shrink-0" 
              })}
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">{filename}</h2>
            </div>
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
              <IconButton 
                variant="outline" 
                size="comfortable" 
                aria-label="Open in new tab"
                onClick={() => {
                  if (asset.url) {
                    window.open(asset.url, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <TabNewIcon size={16} />
              </IconButton>
              <IconButton 
                variant="outline" 
                size="comfortable" 
                aria-label="Copy link"
              >
                <LinkIcon size={16} />
              </IconButton>
              <Button variant="primary">Download</Button>
              <IconButton variant="ghost" aria-label="Close" onClick={() => onOpenChange(false)}>
                <CloseDefaultIcon size={20} />
              </IconButton>
            </div>
          </div>
          
          {/* Modal Content */}
          <div className="flex flex-1">
            {/* Center Column - Large Image */}
            <div className="flex-1 flex flex-col items-center justify-center relative">

              
              <div 
                className="flex items-center justify-center overflow-hidden px-10 h-full w-full flex-1 bg-[var(--bg-tertiary)]"
              >
                <img 
                  src={displayedImageUrl || asset.url}
                  alt={asset.name}
                  className="object-contain w-auto h-auto"
                  style={{ maxWidth: 'calc(100% - 80px)', maxHeight: 'calc(100% - 80px)' }}
                />
              </div>
            </div>
            
            {/* Right Column - Metadata with Tabs */}
            <div className="w-96 bg-[var(--bg-primary)] border-l border-[var(--border-default)]">
              <TabBar value={activeTab} onValueChange={setActiveTab} className="px-4">
                <TabBarItem value="details" className="px-2">Details</TabBarItem>
                <TabBarItem value="insights" className="px-2">Insights</TabBarItem>
                <TabBarItem value="activity" className="px-2">Activity</TabBarItem>
              </TabBar>
              
              <div className="flex-1 p-6 overflow-y-auto">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </ModalPortal>
    </Modal>
  );
};

export default AssetDetailModalDesigner; 