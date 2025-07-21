"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/designer/layout/Navbar";
import LeftSidebar from "@/components/designer/layout/LeftSidebar";
import RightPanel from "@/components/designer/layout/panels/rightpanel/RightPanel";
import Canvas from "@/components/designer/layout/Canvas";
import AppsSection from "@/components/designer/sections/AppsSection";
import CMSSection from "@/components/designer/sections/CMSSection";
import InsightsSection from "@/components/designer/sections/InsightsSection";
import { NavigatorProvider } from "@/context/NavigatorContext";
import { PagesProvider } from "@/context/PagesContext";
import { useApp } from "@/context/AppContext";
import { SidebarPanelContext } from "@/components/designer/layout/LeftSidebar";
import { Asset, getAssetById } from "@/lib/supabase";

interface LayoutContentProps {
  children?: React.ReactNode;
}

// Define panel types
type PanelType = 
  | 'add' 
  | 'pages' 
  | 'navigator' 
  | 'components' 
  | 'variables' 
  | 'styles' 
  | 'assets' 
  | 'apps' 
  | 'activityLog' 
  | null;

function LayoutContentInner({ children }: LayoutContentProps) {
  const pathname = usePathname();
  const { currentSection, isStyleGuideOpen } = useApp();
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [selectedHeroAsset, setSelectedHeroAsset] = useState<Asset | null>(null);
  const [isReplaceMode, setIsReplaceMode] = useState(false);
  
  // Load initial hero asset from Supabase
  useEffect(() => {
    const loadInitialHeroAsset = async () => {
      try {
        // Load asset with ID 29 (fall-refresh-campaign-hero) from Supabase
        const heroAsset = await getAssetById(29);
        setSelectedHeroAsset(heroAsset);
      } catch (error) {
        console.error('Error loading initial hero asset:', error);
        // Fallback to null if asset not found
        setSelectedHeroAsset(null);
      }
    };

    loadInitialHeroAsset();
  }, []);
  
  // Function to open assets panel
  const openAssetsPanel = () => {
    setIsReplaceMode(true); // Set replace mode when opening from Replace button
    setActivePanel('assets');
  };
  
  // Function to open assets panel in normal mode (for detail panel)
  const openAssetsPanelNormal = () => {
    setIsReplaceMode(false); // Set normal mode
    setActivePanel('assets');
  };
  
  // Function to handle asset selection
  const handleAssetSelected = (asset: Asset) => {
    setSelectedHeroAsset(asset);
    setActivePanel(null); // Close the assets panel after selection
    setIsReplaceMode(false); // Reset replace mode
  };
  
  // Check if we're on the dashboard route
  if (pathname?.startsWith('/dashboard')) {
    return children;
  }
  
  // Check if we're on the style guide route
  if (pathname?.startsWith('/style-guide')) {
    return (
      <div className="flex h-screen flex-col">
        <div className="flex-1">
          {children}
        </div>
      </div>
    );
  }
  
  // Check if the current path is the style guide (legacy check)
  if (isStyleGuideOpen) {
    return (
      <div className="flex h-screen flex-col">
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
      </div>
    );
  }
  
  // Render different layouts based on section
  return (
    <SidebarPanelContext.Provider value={{ openAssetsPanel, openAssetsPanelNormal, onAssetSelected: handleAssetSelected, isReplaceMode }}>
      <div className="flex h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          {currentSection === 'home' && (
            <>
              <LeftSidebar activePanel={activePanel} setActivePanel={setActivePanel} />
              <main className="flex-1 bg-[var(--bg-primary)] relative">
                <Canvas selectedHeroAsset={selectedHeroAsset} onAssetSelected={handleAssetSelected} />
              </main>
              <RightPanel />
            </>
          )}
          
          {currentSection === 'apps' && (
            <main className="flex-1 bg-[var(--bg-primary)]">
              <AppsSection />
            </main>
          )}
          
          {currentSection === 'cms' && (
            <main className="flex-1 bg-[var(--bg-primary)]">
              <CMSSection />
            </main>
          )}
          
          {currentSection === 'insights' && (
            <main className="flex-1 bg-[var(--bg-primary)]">
              <InsightsSection />
            </main>
          )}
        </div>
      </div>
    </SidebarPanelContext.Provider>
  );
}

export function LayoutContent(props: LayoutContentProps) {
  return (
    <NavigatorProvider>
      <PagesProvider>
        <LayoutContentInner {...props} />
      </PagesProvider>
    </NavigatorProvider>
  );
}
