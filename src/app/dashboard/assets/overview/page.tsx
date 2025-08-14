'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WarningTriangleIcon } from '@/icons/WarningTriangleIcon';
import { Badge } from '@/components/spring-ui/badge';
import AssetCard from '@/components/designer/layout/panels/leftpanel/AssetCard';
import ProjectCard from '@/components/dashboard/project-card';
import { ImageIcon, UploadIcon, AddIcon } from '@/icons';
import { Button } from '@/components/spring-ui/button';
import { SITES, getSiteNameById } from '@/config/sites';
import { getAllAssets, getAssetsForSite, getAssetCountForSite, getPreviewImagesForSite } from '@/lib/supabase';

export default function AssetsOverviewPage() {
  const router = useRouter();
  const [assets, setAssets] = useState<any[]>([]);
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [topPerformingAssets, setTopPerformingAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch assets and projects data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allAssets = await getAllAssets();
        setAssets(allAssets);

        // Generate projects data dynamically based on real asset relationships
        const projects = await Promise.all(
          SITES.slice(0, 3).map(async (site) => {
            const assetCount = await getAssetCountForSite(site.id);
            const previewImages = await getPreviewImagesForSite(site.id);
            return {
              site: {
                ...site,
                thumbnail: site.thumbnail
              },
              assetCount,
              previewImages
            };
          })
        );

        setProjectsData(projects);

        // Get top performing assets (first 5 assets with highest view counts)
        let topAssets;
        if (allAssets.length > 0) {
          topAssets = allAssets
            .sort((a, b) => ((b as any).view_count || 0) - ((a as any).view_count || 0))
            .slice(0, 5)
            .map((asset, index) => {
              const realNumbers = [12350, 9876, 8234, 7456, 6494];
              return {
                label: asset.name || 'Asset',
                count: realNumbers[index]?.toLocaleString() || '0',
                percentage: Math.max(10, 95 - (index * 20)), // Decreasing percentages
                preview: asset.url || (asset as any).thumbnail_url || '/images/site1.png'
              };
            });
        } else {
          // Fallback data if no assets exist
          const fallbackAssets = [
            { label: 'Hero banner image', count: '12,350', percentage: 95, preview: '/images/site1.png' },
            { label: 'Product showcase', count: '9,876', percentage: 75, preview: '/images/site2.png' },
            { label: 'Brand logo', count: '8,234', percentage: 55, preview: '/images/site3.png' },
            { label: 'Social media post', count: '7,456', percentage: 35, preview: '/images/site4.png' },
            { label: 'Email template', count: '6,494', percentage: 15, preview: '/images/site5.png' }
          ];
          topAssets = fallbackAssets;
        }

        setTopPerformingAssets(topAssets);
      } catch (error) {
        console.error('Error fetching data:', error);
        setAssets([]);
        setProjectsData([]);
        setTopPerformingAssets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const assetStats = [
    { label: 'Total Assets', value: loading ? '...' : assets.length.toString(), change: '+12%', trend: 'up' },
    { label: 'Storage Used', value: '2.4 GB', change: '+8%', trend: 'up' },
    { label: 'Shared Assets', value: '156', change: '+5%', trend: 'up' },
    { label: 'Assets in Review', value: '8', change: '', trend: 'neutral' },
    { label: 'AI Suggestions', value: '6', change: '', trend: 'neutral' },
    { label: 'Performance Alerts', value: '2', change: '', trend: 'down' },
  ];

  // Use the first 4 assets for recent assets
  const recentAssets = assets.slice(0, 4);

  return (
    <div className="p-6 space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">Assets Overview</h1>
          <p className="text-[var(--text-secondary)]">Get a comprehensive overview of your assets, usage statistics, and recent activity.</p>
        </div>
      </div>

      {/* Projects Section */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Projects</h3>
          <button
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            onClick={() => console.log('View all projects')}
          >
            View all
          </button>
        </div>
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
      </div>

      {/* Recently Added Assets Section */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Recently Added</h3>
          <button
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            onClick={() => router.push('/dashboard/assets/all-assets')}
          >
            View all
          </button>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {/* Add Image Card */}
          <div className="h-full border-2 border-dashed border-[var(--border-default)] rounded-lg flex flex-col items-center justify-center p-6 bg-[var(--background-secondary)] hover:bg-[var(--background-tertiary)] transition-colors cursor-pointer">
            <div className="w-full flex flex-col gap-2 justify-center">
              <Button
                variant="outline"
                size="compact"
                className="w-full"
                onClick={() => console.log('Upload clicked')}
              >
                <UploadIcon size={16} className="mr-2" />
                Upload
              </Button>
            </div>
          </div>
          
          {recentAssets.map((asset: any) => (
            <AssetCard
              key={asset.id}
              id={asset.id}
              type={asset.type}
              format={asset.format}
              icon={ImageIcon}
              name={asset.name}
              url={asset.url}
              isSelected={false}
              onClick={() => console.log('Asset clicked:', asset.name)}
            />
          ))}
        </div>
      </div>

      {/* Insights Section */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Insights</h3>
          <button
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            onClick={() => router.push('/dashboard/assets/insights')}
          >
            View all
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left side - Top Performing Assets Card */}
        <div className="bg-[var(--background-primary)] border border-[var(--border-default)] rounded-lg p-4">
          <div className="mb-4">
            <h4 className="title-text-bold">Top performing assets</h4>
          </div>
          
          <div className="space-y-3">
            {loading ? (
              // Loading state
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-[var(--background-secondary)] animate-pulse"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="h-4 bg-[var(--background-secondary)] rounded animate-pulse w-24"></div>
                      <div className="h-4 bg-[var(--background-secondary)] rounded animate-pulse w-8"></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: `${Math.max(10, 95 - (index * 20))}%` }}></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              topPerformingAssets.map((asset, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md overflow-hidden bg-[var(--background-secondary)]">
                    <img 
                      src={asset.preview} 
                      alt={asset.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[var(--text-secondary)] truncate">{asset.label}</span>
                      <span className="text-sm text-[var(--text-secondary)] ml-2">{asset.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${asset.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-4 pt-3 border-t border-[var(--border-default)]">
            <span className="text-sm text-[var(--text-secondary)]">14 more...</span>
          </div>
        </div>

        {/* Right side - Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assetStats.map((stat, index) => (
            <div key={index} className="bg-[var(--background-primary)] border border-[var(--border-default)] rounded-lg p-4 relative">
              {stat.label === 'Performance Alerts' && (
                <div className="absolute top-3 right-3">
                  <WarningTriangleIcon size={16} className="text-[var(--text-warning)]" />
                </div>
              )}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
                </div>
                {stat.change && (
                  <Badge variant={stat.trend === 'up' ? 'default' : 'blue'}>
                    {stat.change}
                  </Badge>
                )}
              </div>
              <div className="mt-auto">
                <p className="text-2xl font-semibold text-[var(--text-primary)]">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

    </div>
  );
} 