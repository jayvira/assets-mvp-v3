'use client';

import { useState, useEffect } from 'react';
import { IconButton } from '@/components/spring-ui/icon-button';
import { Button } from '@/components/spring-ui/button';
import { AddIcon } from '@/icons/AddIcon';
import { ArrowRightIcon } from '@/icons/ArrowRightIcon';
import { RefreshIcon } from '@/icons/RefreshIcon';
import { SiteIcon } from '@/icons/SiteIcon';
import { TabNewIcon } from '@/icons/TabNewIcon';
import { AIOptimizeIcon } from '@/icons/AIOptimizeIcon';
import { getAssetById, Asset } from '@/lib/supabase';

export default function CreateAssetsPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [loadedAssets, setLoadedAssets] = useState<Asset[]>([]);
  
  const loadingMessages = [
    "Reviewing brand guidelines",
    "Creating campaign assets", 
    "Building a page on forme.com"
  ];

  const loadingImages = [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1558655146-d09347e92766?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1558655146-d09347e92766?w=200&h=200&fit=crop"
  ];

  const availableTags = [
    'Style', 'Image prompt', 'Goal', 'Aspect ratio'
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleGenerate = () => {
    // TODO: Implement AI generation logic
    console.log('Generating with prompt:', prompt, 'and tags:', selectedTags);
  };

  const handleArrowClick = () => {
    if (prompt.trim()) {
      setIsLoading(true);
      setLoadingMessageIndex(0);
      
      // Simulate loading time
      setTimeout(async () => {
        try {
          // Load assets 29, 30, 31, 32, 33
          const assetIds = [29, 30, 31, 32, 33];
          const assets = await Promise.all(
            assetIds.map(id => getAssetById(id))
          );
          
          // Filter out any null assets and set the loaded assets
          const validAssets = assets.filter(asset => asset !== null) as Asset[];
          setLoadedAssets(validAssets);
        } catch (error) {
          console.error('Error loading assets:', error);
        }
        
        setIsLoading(false);
        setLoadingMessageIndex(0);
      }, 5000); // 5 seconds
    }
  };

  // Cycle through loading messages
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1500); // Change message every 1.5 seconds
      
      return () => clearInterval(interval);
    }
  }, [isLoading, loadingMessages.length]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Centered Layout */}
        <div className="text-center space-y-8">
          
          {/* Prominent Title */}
          <div className="space-y-4">
            <h1 className="title-text-bold text-4xl text-[var(--text-primary)]">
              {isLoading ? loadingMessages[loadingMessageIndex] : (loadedAssets.length > 0 ? "Forme Fall Refresh Campaign" : "What will you create?")}
            </h1>
            <p className="body-text text-lg text-[var(--text-secondary)]">
              {isLoading ? "AI magic incoming" : (loadedAssets.length > 0 ? "We've gotten you started with a landing page and assets, how else can we help?" : "Describe your vision and let AI bring it to life")}
            </p>
          </div>

          {/* Text Input Area */}
          <div className="space-y-6">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your idea, and I'll bring it to life"
                className="w-full h-32 p-4 pr-20 border border-[var(--border-default)] rounded-lg bg-[var(--background-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
                disabled={isLoading}
              />
              <div className="absolute bottom-3 left-3">
                <IconButton variant="outline" size="comfortable" disabled={isLoading}>
                  <AddIcon />
                </IconButton>
              </div>
              <div className="absolute bottom-3 right-3">
                <IconButton 
                  variant="primary" 
                  size="comfortable"
                  onClick={handleArrowClick}
                  disabled={!prompt.trim() || isLoading}
                >
                  <ArrowRightIcon />
                </IconButton>
              </div>
              
              {/* Loading Overlay on Input */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/90 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-[var(--accent-primary)] rounded-full border-t-transparent animate-spin mx-auto"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Campaign Banner or Tags */}
            {loadedAssets.length > 0 ? (
              <div className="flex items-center justify-between p-4 bg-[var(--blue-bg-transparent)] rounded-lg border border-[var(--border-default)]">
                <div className="flex items-center gap-3">
                  <AIOptimizeIcon className="text-[var(--text-blue)]" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      New campaign page built
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      forme.com/fall-refresh
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="comfortable"
                  onClick={() => window.open('https://marys-prototypes.webflow.io/asset-vision', '_blank')}
                >
                  <TabNewIcon className="mr-2" />
                  Review
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    disabled={isLoading}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                      selectedTags.includes(tag)
                        ? 'bg-[var(--accent-primary)] text-white'
                        : 'bg-black/8 text-[var(--text-secondary)] hover:bg-black/12'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>



          {/* Generated Assets Section */}
          {(isLoading || loadedAssets.length > 0) && (
            <div className="mt-12">
              <div className="flex justify-center gap-6">
                {isLoading ? (
                  loadingImages.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="w-40 h-40 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-gray-400 rounded-full border-t-transparent animate-spin"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  loadedAssets.map((asset, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={asset.url} 
                        alt={asset.altText || `Generated asset ${index + 1}`}
                        className="w-40 h-40 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button className="bg-white/90 text-black px-3 py-1 rounded-md text-sm font-medium">
                          Download
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {loadedAssets.length > 0 && (
            <div className="mt-8 flex justify-center gap-4">
              <Button variant="ghost" size="comfortable" onClick={() => {
                setLoadedAssets([]);
                setPrompt('');
                setSelectedTags([]);
              }}>
                Cancel
              </Button>
              <Button variant="outline" size="comfortable">
                <RefreshIcon className="mr-2" />
                Generate again
              </Button>
            </div>
          )}

          {/* Generate Button */}
          <div className="pt-4">
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isLoading}
              className="px-8 py-4 bg-[var(--accent-primary)] text-white rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-[var(--accent-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--accent-primary)]"
            >
              Generate
            </button>
          </div>
        </div>
      </div>
      

    </div>
  );
} 