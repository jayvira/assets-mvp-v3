"use client";

import React, { useState } from 'react';
import { 
  PageDefaultIcon
} from '@/icons';
import Accordion from '@/components/spring-ui/accordion';
import { Input } from "@/components/spring-ui/input";
import { Row } from "@/components/spring-ui/row";
import { usePages } from '@/context/PagesContext';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { SITE_PAGES, PageItem, PageSection } from '@/config/pages';

const PagesPanel = () => {
  // Use centralized site pages configuration
  const [sections] = useState<PageSection[]>(SITE_PAGES);

  // Use the Pages context
  const { selectedPage, setSelectedPage } = usePages();
  
  // Use the App context to navigate between sections
  const { navigateTo, setViewingTestimonials, clearExplicitCMSNavigation } = useApp();
  
  // Use router to update URL
  const router = useRouter();

  // Get icon for page
  const getPageIcon = (item: PageItem) => {
    return (
      <PageDefaultIcon 
        size={16} 
        style={{ color: item.draft ? 'var(--text-orange)' : 'var(--text-secondary)' }} 
      />
    );
  };

  // Handle page selection
  const handleSelectPage = (path: string) => {
    console.log('Page selected:', path); // Debug log
    
    // Note: Panel closing is handled by useEffect in LeftSidebar that detects page changes
    setSelectedPage(path);
    
    // Special handling for CMS Template pages - add /cms to URL without changing section
    if (path === '/class' || path === '/testimonials') {
      console.log('Updating URL to /mary-prototype/cms'); // Debug log
      // Set the testimonials flag to prevent AppContext from switching sections
      setViewingTestimonials(true);
      // Clear any explicit CMS navigation flag since we're not actually going to CMS section
      clearExplicitCMSNavigation();
      // Use window.history to update URL without triggering router navigation
      // This prevents the AppContext from switching to CMS section
      // Include the full base path
      window.history.pushState({}, '', '/mary-prototype/cms');
    } else {
      // Clear the testimonials flag for other pages
      setViewingTestimonials(false);
      // Clean up the URL by removing /cms when switching to non-CMS pages
      // This prevents the AppContext from detecting /cms and switching sections
      if (window.location.pathname.includes('/cms')) {
        console.log('Cleaning up URL from /cms to /mary-prototype'); // Debug log
        window.history.pushState({}, '', '/mary-prototype');
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-2 pb-2 border-b border-[var(--border-default)]" >
        <Input
          showSearchIcon
          placeholder="Search pages"
        />
      </div>
      
      {/* Sections with Accordion */}
      <div className="flex-1 overflow-y-auto">
        {sections.map((section, index) => (
          <Accordion 
            key={index} 
            title={section.title} 
            defaultOpen={section.expanded}
            titleClassName="title-semibold"
          >
            <div className="pb-2">
              {section.items.map((item, itemIndex) => (
                <Row
                  key={itemIndex}
                  label={item.name}
                  icon={getPageIcon(item)}
                  selected={selectedPage === item.path}
                  size="compact"
                  className={item.draft ? "text-[var(--text-orange)]" : ""}
                  onClick={() => handleSelectPage(item.path)}
                />
              ))}
            </div>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default PagesPanel; 