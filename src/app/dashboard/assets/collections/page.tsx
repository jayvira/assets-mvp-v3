'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ProjectCard from '@/components/dashboard/project-card';
import { SITES, getSiteNameById } from '@/config/sites';
import { getCachedAssetCountsForSites, getCachedPreviewImagesForSites } from '@/lib/supabase';
import { Button } from '@/components/spring-ui/button';
import { Input } from '@/components/spring-ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/spring-ui/dropdown-menu';
import { AddIcon, ChevronSmallDownIcon } from '@/icons';

export default function CollectionsPage() {
  const router = useRouter();
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Memoize site IDs to prevent unnecessary re-computations
  const siteIds = useMemo(() => SITES.map(site => site.id), []);

  // Fetch projects data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch asset counts and preview images for all sites in parallel
        const [assetCounts, previewImages] = await Promise.all([
          getCachedAssetCountsForSites(siteIds),
          getCachedPreviewImagesForSites(siteIds)
        ]);

        // Generate projects data using the fetched data
        const projects = SITES.map(site => ({
          site: {
            ...site,
            thumbnail: site.thumbnail
          },
          assetCount: assetCounts[site.id] || 0,
          previewImages: previewImages[site.id] || []
        }));

        setProjectsData(projects);
      } catch (error) {
        console.error('Error fetching data:', error);
        setProjectsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [siteIds]);

  // Filter and memoize the filtered projects
  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projectsData;
    
    return projectsData.filter((project) => 
      project.site.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projectsData, searchQuery]);

  // Memoize the projects grid to prevent unnecessary re-renders
  const projectsGrid = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {filteredProjects.length > 0 ? (
        filteredProjects.map((project) => (
          <ProjectCard
            key={project.site.id}
            site={project.site}
            assetCount={project.assetCount}
            previewImages={project.previewImages}
            onClick={() => router.push(`/dashboard/assets/collection/${project.site.id}`)}
          />
        ))
      ) : (
        <div className="col-span-3 text-center py-8 text-[var(--text-secondary)]">
          No collections found matching "{searchQuery}"
        </div>
      )}
    </div>
  ), [filteredProjects, router, searchQuery]);

  // Loading skeleton for better perceived performance
  const loadingSkeleton = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg border p-4 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ), []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Collections</h1>
          <div className="flex items-center gap-4">
            <Input
              type="text"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[320px]"
            />
            <Button onClick={() => console.log('Create new collection')}>
              <AddIcon size={16} />
              New
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-[var(--text-secondary)]">
          {loading ? 'Loading collections...' : `${filteredProjects.length} collections`}
        </span>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="compact"
              >
                Sort by: Last updated
                <ChevronSmallDownIcon className="ml-1" size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                Last updated
              </DropdownMenuItem>
              <DropdownMenuItem>
                Name
              </DropdownMenuItem>
              <DropdownMenuItem>
                Oldest
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Collections Section */}
      <div className="mb-8">
        {loading ? loadingSkeleton : projectsGrid}
      </div>
    </div>
  );
} 