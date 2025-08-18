"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export type AppSection = 'home' | 'apps' | 'cms' | 'insights';

type AppContextType = {
  currentSection: AppSection;
  navigateTo: (section: AppSection) => void;
  isStyleGuideOpen: boolean;
  openStyleGuide: () => void;
  closeStyleGuide: () => void;
  setViewingTestimonials: (viewing: boolean) => void;
  clearExplicitCMSNavigation: () => void;
  openCMSItemDetails: (itemId: string) => void;
  pendingCMSItemId: string | null;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentSection, setCurrentSection] = useState<AppSection>('home');
  const [isStyleGuideOpen, setIsStyleGuideOpen] = useState(false);
  const [isViewingTestimonials, setIsViewingTestimonials] = useState(false);
  const [isExplicitlyNavigatingToCMS, setIsExplicitlyNavigatingToCMS] = useState(false);
  const [pendingCMSItemId, setPendingCMSItemId] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Listen for switchToCMSTab event
  useEffect(() => {
    const handleSwitchToCMSTab = () => {
      setIsExplicitlyNavigatingToCMS(true);
      setCurrentSection('cms');
    };

    window.addEventListener('switchToCMSTab', handleSwitchToCMSTab);
    return () => {
      window.removeEventListener('switchToCMSTab', handleSwitchToCMSTab);
    };
  }, []);

  useEffect(() => {
    // Sync URL path with state
    if (pathname) {
      if (pathname.includes('/style-guide')) {
        setIsStyleGuideOpen(true);
      } else {
        setIsStyleGuideOpen(false);
        
        // Special case: If we're viewing testimonials page, stay in home section regardless of URL
        if (isViewingTestimonials) {
          return;
        }
        
        // Special case: Only allow CMS section if explicitly navigating to it
        if (pathname.includes('/cms') && !isExplicitlyNavigatingToCMS) {
          // Don't switch to CMS section if we're not explicitly navigating there
          return;
        }
        
        if (pathname.includes('/apps')) {
          setCurrentSection('apps');
        } else if (pathname.includes('/cms')) {
          setCurrentSection('cms');
        } else if (pathname.includes('/insights')) {
          setCurrentSection('insights');
        } else {
          setCurrentSection('home');
        }
      }
    }
  }, [pathname, isViewingTestimonials, isExplicitlyNavigatingToCMS]);

  const navigateTo = (section: AppSection) => {
    setCurrentSection(section);
    
    // Set the explicit navigation flag when navigating to CMS
    if (section === 'cms') {
      setIsExplicitlyNavigatingToCMS(true);
    } else {
      setIsExplicitlyNavigatingToCMS(false);
    }
    
    // Only navigate to actual routes that exist as Next.js pages
    // Apps, CMS, and Insights are handled by state-based routing in LayoutContent
    if (section === 'home') {
      router.push('/');
    }
    // For apps, cms, insights: only update state, no URL navigation
    // This prevents 404 errors for non-existent pages
  };

  const openStyleGuide = () => {
    setIsStyleGuideOpen(true);
    router.push('/style-guide');
  };

  const closeStyleGuide = () => {
    setIsStyleGuideOpen(false);
    // Only navigate to home URL, let state handle other sections
    if (currentSection === 'home') {
      router.push('/');
    }
    // For other sections, just rely on state
  };

  const setViewingTestimonials = (viewing: boolean) => {
    setIsViewingTestimonials(viewing);
  };

  const clearExplicitCMSNavigation = () => {
    setIsExplicitlyNavigatingToCMS(false);
  };

  const openCMSItemDetails = (itemId: string) => {
    setPendingCMSItemId(itemId);
    setIsExplicitlyNavigatingToCMS(true);
    setCurrentSection('cms');
  };

  return (
    <AppContext.Provider value={{ 
      currentSection, 
      navigateTo, 
      isStyleGuideOpen, 
      openStyleGuide, 
      closeStyleGuide,
      setViewingTestimonials,
      clearExplicitCMSNavigation,
      openCMSItemDetails,
      pendingCMSItemId
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 