"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/spring-ui/button';
import { ImageIcon, UploadIcon, AssetManagerIcon } from '@/icons';
import { IconButton } from '@/components/spring-ui/icon-button';
import { RefreshIcon, CloseDefaultIcon } from '@/icons';
import AssetBrowserModal from './AssetBrowserModal';

interface CMSFormImageCardProps {
  label?: string;
  value?: string | null;
  onChange?: (value: string, fileName?: string) => void;
  onUpload?: () => void;
  onBrowse?: () => void;
  className?: string;
  fileName?: string;
  fileSize?: string;
}

export default function CMSFormImageCard({
  label = "Image",
  value,
  onChange,
  onUpload,
  onBrowse,
  className = "",
  fileName,
  fileSize
}: CMSFormImageCardProps) {
  const [objectUrls, setObjectUrls] = useState<string[]>([]);
  const [isAssetBrowserOpen, setIsAssetBrowserOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEmpty = !value;

  // Handle file uploads
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Generate preview URL for uploaded file
    const previewUrl = URL.createObjectURL(file);
    
    // Track the object URL for cleanup
    setObjectUrls(prev => [...prev, previewUrl]);
    
    // Call onChange with the preview URL and file info
    if (onChange) {
      onChange(previewUrl, file.name);
    }
    
    // Reset input so same file can be uploaded again
    event.target.value = '';
  };

  // Get file name from the value (URL) or use provided fileName
  const getDisplayFileName = () => {
    if (fileName) return fileName;
    if (value && value.startsWith('blob:')) {
      // For uploaded files, we can't get the original name from blob URL
      // So we'll use a generic name
      return 'Uploaded Image';
    }
    return 'Uploaded Image';
  };

  // Handle upload button click
  const handleUploadClick = () => {
    console.log('Upload button clicked');
    console.log('File input ref:', fileInputRef.current);
    if (fileInputRef.current) {
      fileInputRef.current.click();
      console.log('File input click triggered');
    } else {
      console.log('File input ref is null');
    }
  };

  // Handle browse assets click
  const handleBrowseClick = () => {
    setIsAssetBrowserOpen(true);
  };

  // Handle asset selection from modal
  const handleAssetSelect = (asset: any) => {
    if (onChange) {
      onChange(asset.url, asset.name);
    }
  };

  // Cleanup object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      objectUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [objectUrls]);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-xs text-[var(--text-secondary)]">{label}</label>
      )}
      
      {/* Hidden file input for uploads */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
      />
      
      <div className="w-[350px] h-20 border border-[var(--border-default)] rounded-lg flex">
        {/* Left section - Image placeholder or preview */}
        <div className="w-20 flex items-center justify-center border-r border-[var(--border-default)] bg-[var(--bg-tertiary)] rounded-l-lg overflow-hidden">
          {isEmpty ? (
            <ImageIcon size={32} className="text-[var(--text-secondary)]" />
          ) : (
            <div className="w-full h-full">
              <img
                src={value}
                alt={getDisplayFileName()}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-full h-full flex items-center justify-center hidden">
                <span className="text-xs text-[var(--text-secondary)]">Image Preview</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Right section - Action buttons or file info */}
        <div className="flex-1 flex items-center justify-center gap-2 p-2">
          {isEmpty ? (
            <>
              <Button
                size="compact"
                variant="outline"
                className="flex items-center gap-2 text-xs"
                onClick={(e) => {
                  console.log('Button onClick triggered');
                  e.preventDefault();
                  e.stopPropagation();
                  handleUploadClick();
                }}
              >
                <UploadIcon size={16} />
                Upload new
              </Button>
              <Button
                size="compact"
                variant="outline"
                className="flex items-center gap-2 text-xs"
                onClick={handleBrowseClick}
              >
                <AssetManagerIcon size={16} />
                Browse assets
              </Button>
            </>
          ) : (
            <div className="flex items-center justify-between w-full px-2">
              <div className="flex flex-col items-start justify-center">
                <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {getDisplayFileName()}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  96 kB
                </div>
              </div>
              <div className="flex items-center gap-1">
                <IconButton
                  size="comfortable"
                  variant="ghost"
                  onClick={() => setIsAssetBrowserOpen(true)}
                >
                  <RefreshIcon size={16} />
                </IconButton>
                <IconButton
                  size="comfortable"
                  variant="ghost"
                  onClick={() => {
                    if (onChange) {
                      onChange('');
                    }
                  }}
                >
                  <CloseDefaultIcon size={16} />
                </IconButton>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Asset Browser Modal */}
      <AssetBrowserModal
        isOpen={isAssetBrowserOpen}
        onClose={() => setIsAssetBrowserOpen(false)}
        onAssetSelect={handleAssetSelect}
      />
    </div>
  );
} 