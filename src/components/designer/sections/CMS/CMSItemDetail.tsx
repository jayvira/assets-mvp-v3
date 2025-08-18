"use client";

import React, { useState } from 'react';
import { Button } from '@/components/spring-ui/button';
import { Input } from '@/components/spring-ui/input';
import { Textarea } from '@/components/spring-ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/spring-ui/select';
import { IconButton } from '@/components/spring-ui/icon-button';
import { CloseDefaultIcon } from '@/icons/CloseDefaultIcon';
import { CMSCollection, CMSItem } from '../CMSSection';
import CMSFormImageCard from './CMSFormImageCard';

interface CMSItemDetailProps {
  item: CMSItem;
  collection: CMSCollection | null;
  onClose: () => void;
}

export default function CMSItemDetail({
  item,
  collection,
  onClose
}: CMSItemDetailProps) {
  const [editedItem, setEditedItem] = useState<CMSItem>(item);
  const [isDirty, setIsDirty] = useState(false);

  // Update editedItem when item prop changes (for navigation between items)
  React.useEffect(() => {
    setEditedItem(item);
    setIsDirty(false); // Reset dirty state when switching items
  }, [item]);

  const handleFieldChange = (field: keyof CMSItem, value: any) => {
    setEditedItem(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
  };

  const handleContentChange = (field: string, value: any) => {
    setEditedItem(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value
      }
    }));
    setIsDirty(true);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving item:', editedItem);
    setIsDirty(false);
  };

  const handleDiscard = () => {
    setEditedItem(item);
    setIsDirty(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-[calc(100%-248px)] h-full bg-[var(--bg-primary)] border-l border-[var(--border-default)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-2 h-10 border-b border-[var(--border-default)]">
        <div className="flex flex-col">
          <h3 className="title-text-bold text-[var(--text-primary)] truncate">
            Edit Item
          </h3>
  
        </div>
        <IconButton
          onClick={onClose}
          size="compact"
          variant="ghost"
        >
          <CloseDefaultIcon size={16} />
        </IconButton>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-[var(--text-primary)]">Basic Information</h4>
          
          <div className="space-y-2">
            <label className="text-xs text-[var(--text-secondary)]">Name</label>
            <Input
              value={editedItem.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="Item name"
            />
          </div>

          <CMSFormImageCard
            label="Hero image"
            value={editedItem.content?.heroImage || null}
            onChange={(value, fileName) => {
              handleContentChange('heroImage', value);
              if (fileName) {
                handleContentChange('heroImageName', fileName);
              }
            }}
            onUpload={() => console.log('Upload new hero image')}
            onBrowse={() => console.log('Browse hero image assets')}
            fileName={editedItem.content?.heroImageName || undefined}
          />

          <div className="space-y-2">
            <label className="text-xs text-[var(--text-secondary)]">Status</label>
            <Select
              value={editedItem.status}
              onValueChange={(value) => handleFieldChange('status', value as CMSItem['status'])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Fields */}
        {editedItem.content && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-[var(--text-primary)]">Content</h4>
            
            {Object.entries(editedItem.content).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="text-xs text-[var(--text-secondary)] capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                {typeof value === 'string' && value.length > 100 ? (
                  <Textarea
                    value={value}
                    onChange={(e) => handleContentChange(key, e.target.value)}
                    placeholder={`Enter ${key}`}
                    rows={4}
                  />
                ) : (
                  <Input
                    value={String(value)}
                    onChange={(e) => handleContentChange(key, e.target.value)}
                    placeholder={`Enter ${key}`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-[var(--text-primary)]">Metadata</h4>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[var(--text-secondary)]">Created</span>
              <div className="text-[var(--text-primary)]">
                {formatDate(editedItem.createdDate)}
              </div>
            </div>
            <div>
              <span className="text-[var(--text-secondary)]">Modified</span>
              <div className="text-[var(--text-primary)]">
                {formatDate(editedItem.modifiedDate)}
              </div>
            </div>
            <div className="col-span-2">
              <span className="text-[var(--text-secondary)]">Published</span>
              <div className="text-[var(--text-primary)]">
                {formatDate(editedItem.publishedDate)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions - Removed */}
    </div>
  );
} 