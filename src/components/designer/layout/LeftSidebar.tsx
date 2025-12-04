"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';
import Image from 'next/image';
import { useNavigator } from '@/context/NavigatorContext';
import { useMode } from '@/context/ModeContext';
import { usePages } from '@/context/PagesContext';
import { BASE_PATH } from '@/config/paths';
import { ActivityLog24Icon } from '@/icons/ActivityLog24Icon';
import { PagePanel24Icon } from '@/icons/PagePanel24Icon';
import { AssetManager24Icon } from '@/icons/AssetManager24Icon';
import { Audit24Icon } from '@/icons/Audit24Icon';
import { AIWand24Icon } from '@/icons/AIWand24Icon';
import { AddPanel24Icon } from '@/icons/AddPanel24Icon';
import { ComponentFill24Icon } from '@/icons/ComponentFill24Icon';
import { Navigator24Icon } from '@/icons/Navigator24Icon';
import { CapabilityApps24Icon } from '@/icons/CapabilityApps24Icon';
import { CapabilityVariable24Icon } from '@/icons/CapabilityVariable24Icon';
import { ToolbarSettings24Icon } from '@/icons/ToolbarSettings24Icon';
import { ToolbarSearch24Icon } from '@/icons/ToolbarSearch24Icon';
import { VideoTutorialsPanel24Icon } from '@/icons/VideoTutorialsPanel24Icon';
import { StyleManager24Icon } from '@/icons/StyleManager24Icon';
import Tooltip from '@/components/spring-ui/tooltip';
import Panel from './panels/Panel';
import AddPanel from './panels/leftpanel/AddPanel';
import PagesPanel from './panels/leftpanel/PagesPanel';
import NavigatorPanel from './panels/leftpanel/NavigatorPanel';
import AssetsPanel from './panels/leftpanel/AssetsPanel';
import AssetDetailPanel from './panels/leftpanel/AssetDetailPanel';
import AssetDetailModalDesigner from './panels/leftpanel/AssetDetailModalDesigner';
import SettingsPanel from './panels/leftpanel/SettingsPanel';
import LocalizationPanel from './panels/leftpanel/LocalizationPanel';

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
  | 'settings'
  | null;

// Define AssetType for consistency (should match AssetCardProps)
type AssetItemType = 'images' | 'videos' | 'documents';

// Define FullAssetItem type to match AssetDetailPanel expectations
type FullAssetItem = {
  id: number;
  type: AssetItemType;
  icon: any;
  name: string;
  title: string;
  fileSize: string;
  uploadedBy: string;
  uploadedDate: string;
  lastModifiedDate: string;
  url: string;
  fileType?: string;
  tags?: string[];
  status?: string;
  altText?: string;
  width?: number;
  height?: number;
  version?: string;
};

// Add context for opening assets panel
export const SidebarPanelContext = createContext<{ 
  openAssetsPanel: () => void;
  openAssetsPanelNormal: () => void;
  onAssetSelected?: (asset: any) => void;
  isReplaceMode?: boolean;
}>({ 
  openAssetsPanel: () => {},
  openAssetsPanelNormal: () => {},
  onAssetSelected: undefined,
  isReplaceMode: false
});

// Hook to use the sidebar panel context
export const useSidebarPanel = () => {
  const context = useContext(SidebarPanelContext);
  if (!context) {
    throw new Error('useSidebarPanel must be used within a SidebarPanelContext.Provider');
  }
  return context;
};

interface LeftSidebarProps {
  activePanel: PanelType;
  setActivePanel: React.Dispatch<React.SetStateAction<PanelType>>;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ activePanel, setActivePanel }) => {
  const { toggleNavigator } = useNavigator();
  const { mode } = useMode();
  const { selectedPage, setSelectedPage } = usePages();
  const basePath = BASE_PATH;
  const [prevSelectedPage, setPrevSelectedPage] = useState(selectedPage);
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<FullAssetItem | null>(null);
  const { openAssetsPanelNormal } = useSidebarPanel(); // Get the normal mode function
  const [assetDetailModalOpen, setAssetDetailModalOpen] = useState(false);
  const [selectedAssetForModal, setSelectedAssetForModal] = useState<any>(null);
  const [showLocalization, setShowLocalization] = useState(false);

  // Function to toggle panels
  const togglePanel = (panel: PanelType) => {
    if (activePanel === panel) {
      setActivePanel(null);
      setSelectedAssetForDetail(null); // Close asset detail when main panel closes
      setShowLocalization(false); // Reset nested panel state
    } else {
      setActivePanel(panel);
      setSelectedAssetForDetail(null); // Clear asset detail when switching panels
      setShowLocalization(false); // Reset nested panel state when switching
    }
  };

  // Close panel function
  const closePanel = () => {
    setActivePanel(null);
    setSelectedAssetForDetail(null);
    setShowLocalization(false);
  };

  // Handle asset selection from AssetsPanel
  const handleAssetSelected = (asset: FullAssetItem | null) => {
    setSelectedAssetForDetail(asset);
  };

  // Handle opening asset detail modal
  const handleOpenAssetDetailModal = (asset: any) => {
    console.log('LeftSidebar - Opening asset detail modal with asset:', asset);
    console.log('LeftSidebar - Asset altText:', asset.altText);
    setSelectedAssetForModal(asset);
    setAssetDetailModalOpen(true);
  };

  // Effect to close Pages panel when a page is selected
  useEffect(() => {
    if (prevSelectedPage !== selectedPage && activePanel === 'pages') {
      setActivePanel(null);
    }
    setPrevSelectedPage(selectedPage);
  }, [selectedPage, activePanel, prevSelectedPage, setActivePanel]);

  // Function called when an item is selected in AddPanel
  const handleAddPanelItemSelected = () => {
    if (activePanel === 'add') {
      setActivePanel(null);
    }
  };

  // Helper function to get icon style based on active state
  const getIconStyle = (isActive: boolean) => ({
    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
  });

  return (
    <div 
      className="relative h-full w-[35px] bg-[var(--bg-primary)] border-r border-[var(--border-default)] flex-shrink-0 left-sidebar"
    >
      {/* Top Icons */}
      <div className="flex flex-col pt-[4px]">
        {/* Top section */}
        <Tooltip text="Add Panel">
          <div 
            className={`w-[35px] h-[35px] flex items-center justify-center cursor-pointer hover:bg-[var(--bg-tertiary)] group ${activePanel === 'add' ? 'bg-[var(--bg-tertiary)]' : ''}`}
            onClick={() => togglePanel('add')}
          >
            <AddPanel24Icon 
              style={getIconStyle(activePanel === 'add')} 
              className="group-hover:!text-[var(--text-primary)] transition-colors duration-150" 
            />
          </div>
        </Tooltip>
        
        <Tooltip text="Pages">
          <div 
            className={`w-[35px] h-[35px] flex items-center justify-center cursor-pointer hover:bg-[var(--bg-tertiary)] group ${activePanel === 'pages' ? 'bg-[var(--bg-tertiary)]' : ''}`}
            onClick={() => togglePanel('pages')}
          >
            <PagePanel24Icon 
              style={getIconStyle(activePanel === 'pages')} 
              className="group-hover:!text-[var(--text-primary)] transition-colors duration-150" 
            />
          </div>
        </Tooltip>
        
        <Tooltip text="Navigator">
          <div 
            className={`w-[35px] h-[35px] flex items-center justify-center cursor-pointer hover:bg-[var(--bg-tertiary)] group ${activePanel === 'navigator' ? 'bg-[var(--bg-tertiary)]' : ''}`}
            onClick={() => togglePanel('navigator')}
          >
            <Navigator24Icon 
              style={getIconStyle(activePanel === 'navigator')} 
              className="group-hover:!text-[var(--text-primary)] transition-colors duration-150" 
            />
          </div>
        </Tooltip>
        
        {/* First divider */}
        <div className="w-full h-[1px] bg-[var(--border-default)] my-2"></div>
        
        {/* Middle section */}
        <Tooltip text="Components">
          <div 
            className={`w-[35px] h-[35px] flex items-center justify-center cursor-pointer hover:bg-[var(--bg-tertiary)] group ${activePanel === 'components' ? 'bg-[var(--bg-tertiary)]' : ''}`}
            onClick={() => togglePanel('components')}
          >
            <ComponentFill24Icon 
              style={getIconStyle(activePanel === 'components')} 
              className="group-hover:!text-[var(--text-primary)] transition-colors duration-150" 
            />
          </div>
        </Tooltip>
        
        <Tooltip text="Variables">
          <div 
            className={`w-[35px] h-[35px] flex items-center justify-center cursor-pointer hover:bg-[var(--bg-tertiary)] group ${activePanel === 'variables' ? 'bg-[var(--bg-tertiary)]' : ''}`}
            onClick={() => togglePanel('variables')}
          >
            <CapabilityVariable24Icon 
              style={getIconStyle(activePanel === 'variables')} 
              className="group-hover:!text-[var(--text-primary)] transition-colors duration-150" 
            />
          </div>
        </Tooltip>
        
        <Tooltip text="Styles">
          <div 
            className={`w-[35px] h-[35px] flex items-center justify-center cursor-pointer hover:bg-[var(--bg-tertiary)] group ${activePanel === 'styles' ? 'bg-[var(--bg-tertiary)]' : ''}`}
            onClick={() => togglePanel('styles')}
          >
            <StyleManager24Icon 
              style={getIconStyle(activePanel === 'styles')} 
              className="group-hover:!text-[var(--text-primary)] transition-colors duration-150" 
            />
          </div>
        </Tooltip>
        
        <Tooltip text="Assets">
          <div 
            className={`w-[35px] h-[35px] flex items-center justify-center cursor-pointer hover:bg-[var(--bg-tertiary)] group ${activePanel === 'assets' ? 'bg-[var(--bg-tertiary)]' : ''}`}
            onClick={() => {
              if (activePanel === 'assets') {
                // If assets panel is already open, close it
                setActivePanel(null);
                setSelectedAssetForDetail(null);
              } else {
                // If assets panel is closed, open it
                openAssetsPanelNormal();
              }
            }}
          >
            <AssetManager24Icon 
              style={getIconStyle(activePanel === 'assets')} 
              className="group-hover:!text-[var(--text-primary)] transition-colors duration-150" 
            />
          </div>
        </Tooltip>
        
        {/* Second divider */}
        <div className="w-full h-[1px] bg-[var(--border-default)] my-2"></div>
        
        {/* Lower section */}
        <Tooltip text="Apps">
          <div 
            className={`w-[35px] h-[35px] flex items-center justify-center cursor-pointer hover:bg-[var(--bg-tertiary)] group ${activePanel === 'apps' ? 'bg-[var(--bg-tertiary)]' : ''}`}
            onClick={() => togglePanel('apps')}
          >
            <CapabilityApps24Icon 
              style={getIconStyle(activePanel === 'apps')} 
              className="group-hover:!text-[var(--text-primary)] transition-colors duration-150" 
            />
          </div>
        </Tooltip>
        
        <Tooltip text="Activity Log">
          <div 
            className={`w-[35px] h-[35px] flex items-center justify-center cursor-pointer hover:bg-[var(--bg-tertiary)] group ${activePanel === 'activityLog' ? 'bg-[var(--bg-tertiary)]' : ''}`}
            onClick={() => togglePanel('activityLog')}
          >
            <ActivityLog24Icon 
              style={getIconStyle(activePanel === 'activityLog')} 
              className="group-hover:!text-[var(--text-primary)] transition-colors duration-150" 
            />
          </div>
        </Tooltip>
        
        {/* Third divider */}
        <div className="w-full h-[1px] bg-[var(--border-default)] my-2"></div>
        
        {/* Bottom section */}
        <Tooltip text="Settings">
          <div 
            className={`w-[35px] h-[35px] flex items-center justify-center cursor-pointer hover:bg-[var(--bg-tertiary)] group ${activePanel === 'settings' ? 'bg-[var(--bg-tertiary)]' : ''}`}
            onClick={() => togglePanel('settings')}
          >
            <ToolbarSettings24Icon 
              style={getIconStyle(activePanel === 'settings')} 
              className="group-hover:!text-[var(--text-primary)] transition-colors duration-150" 
            />
          </div>
        </Tooltip>
        
        <Tooltip text="Search">
          <div className="w-[35px] h-[35px] flex items-center justify-center cursor-pointer hover:bg-[var(--bg-tertiary)] group">
            <ToolbarSearch24Icon 
              style={{ color: 'var(--text-secondary)' }} 
              className="group-hover:!text-[var(--text-primary)] transition-colors duration-150" 
            />
          </div>
        </Tooltip>
        
        <Tooltip text="Videos">
          <div className="w-[35px] h-[35px] flex items-center justify-center cursor-pointer hover:bg-[var(--bg-tertiary)] group">
            <VideoTutorialsPanel24Icon 
              style={{ color: 'var(--text-secondary)' }} 
              className="group-hover:!text-[var(--text-primary)] transition-colors duration-150" 
            />
          </div>
        </Tooltip>
      </div>

      {/* Panels */}
      <Panel title="Add" isOpen={activePanel === 'add'} onClose={closePanel}>
        <AddPanel onItemSelected={handleAddPanelItemSelected} />
      </Panel>
      
      <Panel title="Pages" isOpen={activePanel === 'pages'} onClose={closePanel}>
        <PagesPanel />
      </Panel>
      
      <Panel title="Navigator" isOpen={activePanel === 'navigator'} onClose={closePanel}>
        <NavigatorPanel />
      </Panel>
      
      <Panel title="Components" isOpen={activePanel === 'components'} onClose={closePanel} />
      <Panel title="Variables" isOpen={activePanel === 'variables'} onClose={closePanel} />
      <Panel title="Styles" isOpen={activePanel === 'styles'} onClose={closePanel} />
      {
        activePanel === 'assets' && (
          <Panel 
            title="Assets" 
            isOpen={activePanel === 'assets'} 
            onClose={closePanel}
            panelWidth={'800px'}
            hideHeader={true}
          >
            <div className="flex h-full w-full">
              <div className="flex-shrink-0 w-full border-r border-[var(--border-default)]">
                <AssetsPanel 
                  onAssetSelect={handleAssetSelected}
                  selectedAssetId={selectedAssetForDetail?.id || null}
                  onClose={closePanel}
                  isDetailPanelOpen={!!selectedAssetForDetail}
                  onOpenAssetDetailModal={handleOpenAssetDetailModal}
                />
              </div>
              {selectedAssetForDetail && (
                <div className="flex-1">
                  <AssetDetailPanel 
                    asset={selectedAssetForDetail}
                    onClose={() => handleAssetSelected(null)}
                  />
                </div>
              )}
            </div>
          </Panel>
        )
      }
      
      <Panel title="Apps" isOpen={activePanel === 'apps'} onClose={closePanel} />
      <Panel title="Activity Log" isOpen={activePanel === 'activityLog'} onClose={closePanel} />
      
      {/* Settings Panel - Always at left-[35px] with width 248px */}
      <Panel 
        title="Settings" 
        isOpen={activePanel === 'settings'} 
        onClose={closePanel}
        panelWidth="248px"
        leftOffset="35px"
      >
        <SettingsPanel
          onNavigateToLocalization={() => setShowLocalization(true)}
          showLocalization={showLocalization}
          onBack={() => setShowLocalization(false)}
        />
      </Panel>
      
      {/* Localization Panel - Extends Settings panel when showLocalization is true */}
      {activePanel === 'settings' && showLocalization && (
        <Panel 
          title="Localization" 
          isOpen={true} 
          onClose={() => setShowLocalization(false)}
          panelWidth="520px"
          leftOffset="283px"
        >
          <LocalizationPanel onBack={() => setShowLocalization(false)} />
        </Panel>
      )}
      
      {/* Asset Detail Modal - Rendered outside Panel structure */}
      {assetDetailModalOpen && selectedAssetForModal && (
        <AssetDetailModalDesigner
          open={assetDetailModalOpen}
          onOpenChange={setAssetDetailModalOpen}
          asset={selectedAssetForModal}
        />
      )}
    </div>
  );
};

export default LeftSidebar;