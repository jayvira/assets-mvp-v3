"use client";

import React, { useState } from 'react';
import { usePages } from '@/context/PagesContext';
import { getAssetById, Asset } from '@/lib/supabase';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/spring-ui/popover';
import { Button } from '@/components/spring-ui/button';
import { Input } from '@/components/spring-ui/input';
import { Textarea } from '@/components/spring-ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/spring-ui/select';
import { SettingsIcon, ArrowLeftIcon } from '@/icons';
import { ArrowRightIcon } from '@/icons/ArrowRightIcon';
import { useSidebarPanel } from './LeftSidebar';

interface CanvasProps {
  selectedHeroAsset: Asset | null;
  onAssetSelected: (asset: Asset) => void;
}

const Canvas: React.FC<CanvasProps> = ({ selectedHeroAsset, onAssetSelected }) => {
  const { selectedPage } = usePages();
  const [selectedHeroImage, setSelectedHeroImage] = React.useState(false);
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [aiEditPopoverOpen, setAiEditPopoverOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiEditing, setIsAiEditing] = useState(false);
  const [isAiEditComplete, setIsAiEditComplete] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  
  const loadingMessages = [
    "Reviewing brand colors",
    "Applying primary red #F8572F",
    "Analyzing image composition",
    "Generating enhanced version"
  ];
  const [assetCache, setAssetCache] = React.useState<{[key: number]: Asset}>({});
  const [fallRefreshAssets, setFallRefreshAssets] = React.useState<{[key: number]: Asset}>({});
  const [originalAsset, setOriginalAsset] = React.useState<Asset | null>(null);
  const { openAssetsPanel } = useSidebarPanel();

  // Helper function to get asset with caching
  const getAssetWithCache = async (id: number): Promise<Asset | null> => {
    if (assetCache[id]) {
      return assetCache[id];
    }
    const asset = await getAssetById(id);
    if (asset) {
      setAssetCache(prev => ({ ...prev, [id]: asset }));
    }
    return asset;
  };

  // Load fall refresh campaign assets
  React.useEffect(() => {
    const loadFallRefreshAssets = async () => {
      const assetIds = [30, 31, 32, 33]; // Pilates, Strength, Mindfulness, Community
      const assets: {[key: number]: Asset} = {};
      
      for (const id of assetIds) {
        try {
          const asset = await getAssetById(id);
          if (asset) {
            assets[id] = asset;
          }
        } catch (error) {
          console.error(`Error loading asset ${id}:`, error);
        }
      }
      
      setFallRefreshAssets(assets);
    };

    if (selectedPage === '/fall-refresh-campaign') {
      loadFallRefreshAssets();
    }
  }, [selectedPage]);

  // Handle click outside to deselect
  const handleCanvasClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('#hero-image') && !target.closest('.hero-image-container')) {
      setSelectedHeroImage(false);
    }
  };

  // Handle asset selection from AssetsPanel
  const handleAssetSelected = (asset: Asset) => {
    onAssetSelected(asset);
    setSelectedHeroImage(false); // Close the selection when asset is replaced
  };

  // Handle AI edit button click
  const handleAiEditClick = () => {
    console.log('AI Edit button clicked');
    setPopoverOpen(false);
    setTimeout(() => {
      setAiEditPopoverOpen(true);
      console.log('AI Edit popover should be open');
    }, 100);
  };

  // Handle AI edit submission
  const handleAiEditSubmit = () => {
    console.log('AI Edit submitted with prompt:', aiPrompt);
    setIsAiEditing(true);
    setIsAiEditComplete(false);
    setLoadingMessageIndex(0);
    
    // Store the original asset before replacing it
    if (selectedHeroAsset) {
      setOriginalAsset(selectedHeroAsset);
    }
    
    // Simulate AI processing time
    setTimeout(async () => {
      try {
        // Load asset 56 from Supabase
        const newAsset = await getAssetById(56);
        if (newAsset) {
          // Replace the current hero asset with the new one
          onAssetSelected(newAsset);
        }
      } catch (error) {
        console.error('Error loading asset 56:', error);
      }
      
      setIsAiEditing(false);
      setIsAiEditComplete(true);
    }, 3000); // 3 seconds to simulate AI processing
  };

  // Handle accept button click
  const handleAccept = () => {
    setAiEditPopoverOpen(false);
    setIsAiEditComplete(false);
    setAiPrompt('');
    setOriginalAsset(null);
  };

  // Handle deny button click
  const handleDeny = () => {
    setAiEditPopoverOpen(false);
    setIsAiEditComplete(false);
    setAiPrompt('');
    setOriginalAsset(null);
  };

  // Handle A/B test button click
  const handleABTest = () => {
    console.log('A/B test button clicked');
    // TODO: Implement A/B test functionality
    setAiEditPopoverOpen(false);
    setIsAiEditComplete(false);
    setAiPrompt('');
    setOriginalAsset(null);
  };

  // Cycle through loading messages
  React.useEffect(() => {
    if (isAiEditing) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 800); // Change message every 800ms
      
      return () => clearInterval(interval);
    }
  }, [isAiEditing, loadingMessages.length]);

  // Placeholder content for different pages
  const renderPageContent = () => {
    switch (selectedPage) {
      case '/':
        return (
          <div className="w-full h-full relative">
            <img 
              src="https://cdn.prod.website-files.com/687d379371b4f02fa4f58460/687dbb91da28da0f49ea92ed_Screenshot%202025-07-20%20at%204.27.59%E2%80%AFPM.png"
              alt="Forme Homepage"
              className="w-full object-cover object-top"
              onError={(e) => {
                console.error('Image failed to load:', e);
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        );
      case '/contact':
        return (
          <div className="p-8" style={{ color: 'var(--black)' }}>
            <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
            <p>This is the contact page content placeholder.</p>
          </div>
        );
      case '/styles':
        return (
          <div className="p-8" style={{ color: 'var(--black)' }}>
            <h1 className="text-2xl font-bold mb-4">Styles</h1>
            <p>This is the styles page content placeholder.</p>
          </div>
        );
      case '/testimonials':
        return (
          <div className="p-8" style={{ color: 'var(--black)' }}>
            <h1 className="text-2xl font-bold mb-4">Testimonials</h1>
            <p>This is the testimonials page content placeholder.</p>
          </div>
        );
      case '/password':
        return (
          <div className="p-8" style={{ color: 'var(--black)' }}>
            <h1 className="text-2xl font-bold mb-4">Password Protected</h1>
            <p>This page is password protected.</p>
            <div className="mt-4">
              <input 
                type="password" 
                placeholder="Enter password"
                className="px-3 py-2 border border-gray-300 rounded"
              />
              <button 
                type="button" 
                className="px-4 py-2 ml-2"
                style={{ 
                  backgroundColor: 'var(--blue-400)',
                  color: 'var(--white)'
                }}
              >
                Submit
              </button>
            </div>
          </div>
        );
      case '/404':
        return (
          <div className="p-8" style={{ color: 'var(--black)' }}>
            <h1 className="text-2xl font-bold mb-4">404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <button 
              type="button" 
              className="px-4 py-2 mt-4"
              style={{ 
                backgroundColor: 'var(--blue-400)',
                color: 'var(--white)'
              }}
            >
              Return Home
            </button>
          </div>
        );
      case '/fall-refresh-campaign':
        return (
          <div className="w-full h-full bg-white overflow-auto">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                    <span className="text-white text-sm font-bold">+</span>
                  </div>
                  <span className="text-xl font-bold text-black">Forme</span>
                </div>
                <nav className="flex items-center space-x-6">
                  <a href="#" className="text-black hover:text-gray-600 flex items-center space-x-1">
                    <span>Classes</span>
                    <span className="text-xs">▼</span>
                  </a>
                  <a href="#" className="text-black hover:text-gray-600 flex items-center space-x-1">
                    <span>About</span>
                    <span className="text-xs">▼</span>
                  </a>
                  <a href="#" className="text-black hover:text-gray-600 flex items-center space-x-1">
                    <span>Blog</span>
                    <span className="text-xs">▼</span>
                  </a>
                  <a href="#" className="text-black hover:text-gray-600 flex items-center space-x-1">
                    <span>Support</span>
                    <span className="text-xs">▼</span>
                  </a>
                </nav>
              </div>
              <button className="px-6 py-2 border border-black rounded-lg text-black hover:bg-gray-50">
                Join now
              </button>
            </header>

            {/* Hero Section */}
            <section className="px-8 py-16 flex items-center">
              <div className="flex-1 pr-16">
                <div className="mb-4">
                  <span className="text-orange-500 font-semibold text-sm">THIS FALL</span>
                </div>
                <h1 className="text-6xl font-bold text-black mb-6 leading-tight">
                  Move. Sweat. Belong.
                </h1>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Reignite your wellness journey this Fall with premium fitness classes designed for busy professionals who demand excellence.
                </p>
                
                {/* Features */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <span className="text-black">⚡</span>
                    <span className="text-black">Expert-led group classes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-black">🔄</span>
                    <span className="text-black">Design-forward studio spaces</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-black">❤️</span>
                    <span className="text-black">Supportive, vibrant community</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex space-x-4">
                  <button className="px-8 py-3 border border-black rounded-lg text-black hover:bg-gray-50 font-semibold">
                    Start your free month
                  </button>
                  <button className="px-8 py-3 border border-black rounded-lg text-black hover:bg-gray-50 font-semibold">
                    Find your studio
                  </button>
                </div>
              </div>
              
              {/* Hero Image */}
              <div className={`flex-1 relative rounded-lg cursor-pointer hero-image-container ${selectedHeroImage ? 'border-2 border-blue-500' : 'border-2 border-transparent'}`}>
                {/* Selection Tag */}
                {selectedHeroImage && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center space-x-1 z-10">
                    <span>image_cover</span>
                    <Popover modal open={popoverOpen} onOpenChange={setPopoverOpen}>
                      <PopoverTrigger asChild>
                        <button className="hover:bg-blue-600 transition-colors p-1 rounded flex items-center justify-center">
                          <SettingsIcon size={12} className="text-white" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" title="Image settings">
                        {/* Image Preview */}
                        <div className="p-4" onClick={(e) => e.stopPropagation()}>
                          <div className="w-full h-32 bg-gray-100 rounded mb-4 flex items-center justify-center relative group">
                            <img 
                              src={selectedHeroAsset?.url || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"}
                              alt="Preview"
                              className="w-full h-full object-cover rounded"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="primary" size="compact" onClick={() => {
                                setPopoverOpen(false); // Close the popover first
                                // Small delay to ensure popover is closed
                                setTimeout(() => {
                                  openAssetsPanel();
                                }, 100);
                              }}>Replace</Button>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="space-y-2 mb-4">
                            <Button className="w-full" variant="outline" onClick={handleAiEditClick}>
                              <img 
                                src="https://cdn.prod.website-files.com/687d379371b4f02fa4f58460/687d5cb32b208d4435d0b0ca_icon_AIEdit.svg"
                                alt="AI Edit"
                                className="w-4 h-4 mr-2"
                              />
                              Edit image
                            </Button>
                          </div>
                          
                          {/* Settings */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium">Fit</label>
                              <Select defaultValue="cover">
                                <SelectTrigger className="w-48">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cover">Cover</SelectItem>
                                  <SelectItem value="contain">Contain</SelectItem>
                                  <SelectItem value="fill">Fill</SelectItem>
                                  <SelectItem value="crop">Crop</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="flex items-start justify-between">
                              <label className="text-sm font-medium mt-2">Alt text</label>
                              <Textarea 
                                defaultValue={selectedHeroAsset?.altText || "image of fitness class for a wellness center"}
                                className="text-sm w-48 h-20 resize-none"
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Footer */}
                        <div className="p-3" onClick={(e) => e.stopPropagation()}>
                          <Button className="w-full" variant="outline">
                            Show all settings
                            <span className="ml-2">→</span>
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
                <img 
                  id="hero-image"
                  src={selectedHeroAsset?.url || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"}
                  alt={selectedHeroAsset?.altText || "Fall refresh campaign hero image"}
                  className="w-full h-96 object-cover rounded-lg"
                  onClick={() => setSelectedHeroImage(!selectedHeroImage)}
                />
                {isAiEditing && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-8 h-8 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                      <span className="text-white text-sm">{loadingMessages[loadingMessageIndex]}</span>
                    </div>
                  </div>
                )}
                
                {/* AI Edit Popover positioned under the image */}
                {aiEditPopoverOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-50">
                    <div className="w-full pt-2 pb-4 px-4 bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-lg shadow-lg border border-[var(--border-default)]">
                      {!isAiEditComplete ? (
                        <>
                          {/* Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div></div>
                          </div>
                          
                          {/* AI Prompt Input */}
                          <div className="mb-4">
                            <div className="relative">
                              <textarea
                                placeholder="Change the lighting in this image to be"
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                className="w-full h-28 p-3 rounded-[4px] border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] placeholder-[var(--input-placeholder)] resize-none focus:outline-none focus:border-[var(--input-border-focus)]"
                                disabled={isAiEditing}
                              />
                              <div className="absolute bottom-3 left-2 flex items-center gap-2">
                                <div className="flex gap-1">
                                  <Button variant="outline" size="compact" className="text-xs h-6 px-2" disabled={isAiEditing}>
                                    Add object
                                  </Button>
                                  <Button variant="outline" size="compact" className="text-xs h-6 px-2" disabled={isAiEditing}>
                                    Remove shadows
                                  </Button>
                                  <Button variant="outline" size="compact" className="text-xs h-6 px-2" disabled={isAiEditing}>
                                    Remove object
                                  </Button>
                                  <Button variant="outline" size="compact" className="text-xs h-6 px-2" disabled={isAiEditing}>
                                    Remove background
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Bottom Buttons */}
                          <div className="flex items-center justify-between">
                            <button 
                              onClick={() => setAiEditPopoverOpen(false)}
                              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                              disabled={isAiEditing}
                            >
                              <ArrowLeftIcon size={16} />
                            </button>
                            <Button 
                              className="w-auto"
                              onClick={handleAiEditSubmit}
                              disabled={isAiEditing}
                            >
                              {isAiEditing ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-current rounded-full border-t-transparent animate-spin mr-2"></div>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <img 
                                    src="https://cdn.prod.website-files.com/687d379371b4f02fa4f58460/687d5cb32b208d4435d0b0ca_icon_AIEdit.svg"
                                    alt="AI Edit"
                                    className="w-4 h-4 mr-2"
                                  />
                                  Edit image
                                </>
                              )}
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Post-Edit Content */}
                          <div className="relative mb-4">
                            <button 
                              onClick={() => setAiEditPopoverOpen(false)}
                              className="absolute left-0 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            >
                              <ArrowLeftIcon size={16} />
                            </button>
                            <h3 className="text-base font-medium text-[var(--text-primary)] text-center">
                              How does this look?
                            </h3>
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex gap-2">
                              <Button 
                                variant="outline" 
                                size="comfortable"
                                onClick={handleABTest}
                              >
                                A/B test
                              </Button>
                              <Button 
                                variant="primary" 
                                size="comfortable"
                                onClick={handleAccept}
                              >
                                Accept
                              </Button>
                            </div>
                          </div>
                          
                          {/* Image Comparison */}
                          <div className="flex items-center gap-4 mb-2">
                            <div className="flex-1">
                              <img 
                                src={originalAsset?.url || selectedHeroAsset?.url || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"}
                                alt="Original image"
                                className="w-full h-32 object-cover rounded border border-[var(--border-default)]"
                              />
                            </div>
                            <div className="flex items-center justify-center">
                              <ArrowRightIcon size={20} className="text-[var(--text-secondary)]" />
                            </div>
                            <div className="flex-1">
                              <img 
                                src={selectedHeroAsset?.url || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"}
                                alt="New asset"
                                className="w-full h-32 object-cover rounded border-2 border-blue-500"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Class Types Section */}
            <section className="px-8 py-16 bg-gray-50">
              <div className="text-center mb-12">
                <div className="text-gray-500 text-sm mb-2">DISCOVER YOUR STRONG</div>
                <h2 className="text-4xl font-bold text-black">Find Your Perfect Class Fit</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Pilates Card */}
                <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <img 
                    src={fallRefreshAssets[30]?.url || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"}
                    alt={fallRefreshAssets[30]?.altText || "Fall refresh campaign pilates class image"}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-black mb-3">Pilates: Power Meets Precision</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Sculpt, stretch, and strengthen. Build core confidence and tone your entire body with our expert-led Pilates sessions.
                    </p>
                  </div>
                </div>

                {/* Strength Card */}
                <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <img 
                    src={fallRefreshAssets[31]?.url || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"}
                    alt={fallRefreshAssets[31]?.altText || "Fall refresh campaign strength training image"}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-black mb-3">Strength: Push Your Limits</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Lift spirits and build power. Dynamic sessions designed to challenge and transform your strength and endurance.
                    </p>
                  </div>
                </div>

                {/* Mindfulness Card */}
                <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <img 
                    src={fallRefreshAssets[32]?.url || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"}
                    alt={fallRefreshAssets[32]?.altText || "Fall refresh campaign mindfulness and wellness image"}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-black mb-3">Mindfulness: Breathe & Flow</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Find your center through mindful movement. Balance body and mind with breathing techniques and gentle flow.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Bottom CTA Section */}
            <section className="px-8 py-16 flex items-center">
              <div className="flex-1 pr-16">
                <h2 className="text-5xl font-bold text-black mb-8">
                  Move. Sweat. Belong. Repeat.
                </h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <span className="text-orange-500">→</span>
                    <span className="text-black">Pilates, barre, and strength—your way.</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-orange-500">→</span>
                    <span className="text-black">Design-forward studios. Energizing vibes.</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-orange-500">→</span>
                    <span className="text-black">Find your fit. Join our community.</span>
                  </div>
                </div>

                <button className="px-8 py-3 border border-black rounded-lg text-black hover:bg-gray-50 font-semibold">
                  Start your free month
                </button>
              </div>
              
              <div className="flex-1">
                <img 
                  src={fallRefreshAssets[33]?.url || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"}
                  alt={fallRefreshAssets[33]?.altText || "Fall refresh campaign community studio image"}
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>
            </section>
          </div>
        );
      default:
        return (
          <div className="p-8" style={{ color: 'var(--black)' }}>
            <h1 className="text-2xl font-bold mb-4">Select a Page</h1>
            <p>Please select a page from the Pages panel.</p>
          </div>
        );
    }
  };

  return (
    <div 
      className="absolute inset-0 w-full h-full overflow-auto"
      style={{ backgroundColor: 'var(--white)' }}
      onClick={handleCanvasClick}
    >
      {renderPageContent()}
      
    </div>
  );
};

export default Canvas;