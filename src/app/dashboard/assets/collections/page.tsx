'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ProjectCard from '@/components/dashboard/project-card';
import { SITES, getSiteNameById } from '@/config/sites';
import { getCachedAssetCountsForSites, getCachedPreviewImagesForSites } from '@/lib/supabase';

export default function CollectionsPage() {
  const router = useRouter();
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Memoize the projects grid to prevent unnecessary re-renders
  const projectsGrid = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {projectsData.map((project) => (
        <ProjectCard
          key={project.site.id}
          site={project.site}
          assetCount={project.assetCount}
          previewImages={project.previewImages}
          onClick={() => router.push(`/dashboard/assets/all-assets?site=${project.site.id}`)}
        />
      ))}
    </div>
  ), [projectsData, router]);

  // Loading skeleton for better perceived performance
  const loadingSkeleton = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Collections</h1>
        <p className="text-[var(--text-secondary)] mt-2">Manage your asset collections</p>
      </div>
      
      {/* Projects Section */}
      <div className="mb-8">
        {loading ? loadingSkeleton : projectsGrid}
      </div>
    </div>
  );
} 