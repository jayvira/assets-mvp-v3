"use client";

import React, { useState } from 'react';
import { 
  PageDefaultIcon
} from '@/icons';
import Accordion from '@/components/spring-ui/accordion';
import { Input } from "@/components/spring-ui/input";
import { Row } from "@/components/spring-ui/row";
import { usePages } from '@/context/PagesContext';
import { SITE_PAGES, PageItem, PageSection } from '@/config/pages';

const PagesPanel = () => {
  // Use centralized site pages configuration
  const [sections] = useState<PageSection[]>(SITE_PAGES);

  // Use the Pages context
  const { selectedPage, setSelectedPage } = usePages();

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
    // Note: Panel closing is handled by useEffect in LeftSidebar that detects page changes
    setSelectedPage(path);
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