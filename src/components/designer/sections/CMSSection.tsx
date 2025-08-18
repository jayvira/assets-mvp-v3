"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import CMSNavigation from './CMS/CMSNavigation';
import CMSTable from './CMS/CMSTable';
import CMSItemDetail from './CMS/CMSItemDetail';

// Mock data types
export interface CMSCollection {
  id: string;
  name: string;
  itemCount: number;
}

export interface CMSItem {
  id: string;
  name: string;
  publishedDate: string | null;
  status: 'published' | 'draft' | 'archived';
  createdDate: string;
  modifiedDate: string;
  content?: Record<string, any>;
}

// Mock collections (without itemCount - will be calculated)
const mockCollectionData = [
  { id: '1', name: 'Classes' },
  { id: '2', name: 'Products' },
  { id: '3', name: 'Team Members' },
  { id: '4', name: 'Case Studies' },
];

const mockItems: Record<string, CMSItem[]> = {
  '1': [
    {
      id: '1',
      name: 'Power Pilates',
      publishedDate: '2024-01-15',
      status: 'published',
      createdDate: '2024-01-10',
      modifiedDate: '2024-01-15',
      content: { title: 'Power Pilates', body: 'Lorem ipsum...' }
    },
    {
      id: '2',
      name: 'Restorative Yoga',
      publishedDate: null,
      status: 'draft',
      createdDate: '2024-01-12',
      modifiedDate: '2024-01-14',
      content: { title: 'Restorative Yoga', body: 'Lorem ipsum...' }
    },
  ],
  '2': [
    {
      id: '3',
      name: 'Premium Widget Pro',
      publishedDate: '2024-01-01',
      status: 'published',
      createdDate: '2023-12-15',
      modifiedDate: '2024-01-01',
      content: { name: 'Premium Widget Pro', price: '$99.99', description: 'A premium widget...' }
    },
  ],
  '3': [
    {
      id: '4',
      name: 'John Doe',
      publishedDate: '2024-01-01',
      status: 'published',
      createdDate: '2023-12-01',
      modifiedDate: '2024-01-01',
      content: { name: 'John Doe', role: 'CEO', bio: 'John is our fearless leader...' }
    },
  ],
  '4': [
    {
      id: '5',
      name: 'Enterprise Migration Success',
      publishedDate: '2024-01-10',
      status: 'published',
      createdDate: '2024-01-05',
      modifiedDate: '2024-01-10',
      content: { title: 'Enterprise Migration Success', client: 'Acme Corp', outcome: 'Successful migration...' }
    },
  ],
};

export default function CMSSection() {
  const { currentSection, pendingCMSItemId } = useApp();
  // Calculate actual item counts from mockItems
  const mockCollections: CMSCollection[] = mockCollectionData.map(collection => ({
    ...collection,
    itemCount: mockItems[collection.id]?.length || 0
  }));

  const [selectedCollection, setSelectedCollection] = useState<CMSCollection | null>(() => mockCollections[0]);
  const [selectedItem, setSelectedItem] = useState<CMSItem | null>(() => null);
  const [searchQuery, setSearchQuery] = useState(() => '');

  const currentItems = selectedCollection ? mockItems[selectedCollection.id] || [] : [];
  const filteredItems = currentItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCollectionSelect = (collection: CMSCollection) => {
    setSelectedCollection(collection);
    setSelectedItem(null); // Clear item selection when changing collections
  };

  const handleItemSelect = (item: CMSItem) => {
    setSelectedItem(item);
  };

  const handleItemClose = () => {
    setSelectedItem(null);
  };

  // Handle pending CMS item
  React.useEffect(() => {
    if (pendingCMSItemId === 'power-pilates' && currentSection === 'cms') {
      // Find the Classes collection (first collection)
      const classesCollection = mockCollections[0];
      
      // Find Power Pilates item
      const powerPilatesItem = mockItems['1'][0]; // First item in Classes collection
      
      // Set states
      setSelectedCollection(classesCollection);
      setSelectedItem(powerPilatesItem);
    }
  }, [pendingCMSItemId, currentSection]);

  // Keyboard navigation for items
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem || filteredItems.length === 0) return;

      const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id);
      
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        let nextIndex;
        
        if (e.key === 'ArrowUp') {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
        } else {
          nextIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
        }
        
        setSelectedItem(filteredItems[nextIndex]);
      }
      
      if (e.key === 'Escape') {
        setSelectedItem(null);
      }
    };

    if (selectedItem) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedItem, filteredItems]);

  return (
    <div className="flex h-full bg-[var(--bg-primary)]">
      {/* Left Navigation Panel */}
      <CMSNavigation
        collections={mockCollections}
        selectedCollection={selectedCollection}
        onCollectionSelect={handleCollectionSelect}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Table Area */}
        <div className={selectedItem ? 'w-[248px]' : 'flex-1'}>
          <CMSTable
            collection={selectedCollection}
            items={filteredItems}
            selectedItem={selectedItem}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onItemSelect={handleItemSelect}
            isCompact={!!selectedItem}
          />
        </div>
        
        {/* Right Detail Panel */}
        {selectedItem && (
          <CMSItemDetail
            item={selectedItem}
            collection={selectedCollection}
            onClose={handleItemClose}
          />
        )}
      </div>
    </div>
  );
} 