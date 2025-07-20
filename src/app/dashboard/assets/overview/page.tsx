'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AISparkleIcon } from '@/icons/AISparkleIcon';
import { Badge } from '@/components/spring-ui/badge';
import { AIToolCard } from '@/components/dashboard/ai-tool-card';
import AssetCard from '@/components/designer/layout/panels/leftpanel/AssetCard';
import ProjectCard from '@/components/dashboard/project-card';
import { ImageIcon, UploadIcon, AddIcon } from '@/icons';
import { Button } from '@/components/spring-ui/button';
import { SITES, getSiteNameById } from '@/config/sites';
import { ASSETS, getAssetsForSite, getAssetCountForSite, getPreviewImagesForSite } from '@/config/assets';

// Use centralized assets data
const mockAssets = ASSETS;

export default function AssetsOverviewPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const assetStats = [
    { label: 'Total Assets', value: '1,247', change: '+12%', trend: 'up' },
    { label: 'Storage Used', value: '2.4 GB', change: '+8%', trend: 'up' },
    { label: 'Recent Uploads', value: '23', change: '+15%', trend: 'up' },
    { label: 'Shared Assets', value: '156', change: '+5%', trend: 'up' },
    { label: 'Assets in Review', value: '8', change: '', trend: 'neutral' },
    { label: 'AI Suggestions', value: '6', change: '', trend: 'neutral' },
    { label: 'Performance Alert', value: '2', change: 'hero images', trend: 'down' },
  ];

  // Use the first 4 assets from the mock data for recent assets
  const recentAssets = mockAssets.slice(0, 4);

  // Generate projects data dynamically based on real asset relationships
  const projectsData = SITES.slice(0, 3).map(site => ({
    site: {
      ...site,
      thumbnail: site.thumbnail
    },
    assetCount: getAssetCountForSite(site.id),
    previewImages: getPreviewImagesForSite(site.id)
  }));

  return (
    <div className="p-6 space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">Assets Overview</h1>
          <p className="text-[var(--text-secondary)]">Get a comprehensive overview of your assets, usage statistics, and recent activity.</p>
        </div>
      </div>

      {/* AI Chat Input */}
      <div className="pt-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none pt-4">
          <AISparkleIcon size={16} className="text-[var(--text-secondary)]" />
        </div>
        <input
          type="text"
          placeholder="Use AI to generate images, find assets, or get recommendations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && searchQuery.trim()) {
              console.log('AI Chat submitted:', searchQuery);
              setSearchQuery('');
            }
          }}
          className="w-full pl-10 pr-12 py-3 border border-[var(--border-default)] rounded-lg bg-[var(--background-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center"
        />
        <button
          onClick={() => {
            if (searchQuery.trim()) {
              console.log('AI Chat submitted:', searchQuery);
              setSearchQuery('');
            }
          }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors pt-4"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {assetStats.map((stat, index) => (
          <div key={index} className="bg-[var(--background-primary)] border border-[var(--border-default)] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
                <p className="text-2xl font-semibold text-[var(--text-primary)]">{stat.value}</p>
              </div>
              <Badge variant={stat.trend === 'up' ? 'default' : 'blue'}>
                {stat.change}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* AI Prompts Section */}
      <div className="pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AIToolCard
            title="Image"
            description="Generate images with your styles and brand guidelines."
            icon="🖼️"
            iconBgColor="bg-blue-500"
            onClick={() => router.push('/dashboard/assets/create')}
            onOpenClick={() => router.push('/dashboard/assets/create')}
          />
          
          <AIToolCard
            title="Edit"
            description="Modify style, backgrounds and more."
            icon="✏️"
            iconBgColor="bg-purple-500"
            onOpenClick={() => console.log('Open Image Editor')}
          />
          
          <AIToolCard
            title="Chat"
            description="Work with our AI to generate images or get recommendations based on your unique needs."
            icon="💬"
            iconBgColor="bg-green-500"
            onOpenClick={() => console.log('Open AI Chat')}
          />
          
          <AIToolCard
            title="Train & Guide"
            description="Teach AI to work within your brand guidelines and goals."
            icon="🧠"
            iconBgColor="bg-gray-600"
            onClick={() => router.push('/dashboard/assets/guidelines')}
            onOpenClick={() => router.push('/dashboard/assets/guidelines')}
          />
        </div>
      </div>

      {/* Projects Section */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Projects</h3>
          <button
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
            onClick={() => console.log('View all projects')}
          >
            View all
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projectsData.map((project) => (
            <ProjectCard
              key={project.site.id}
              site={project.site}
              assetCount={project.assetCount}
              previewImages={project.previewImages}
              onClick={() => console.log('Project clicked:', project.site.name)}
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
              <Button
                variant="outline"
                size="compact"
                className="w-full"
                onClick={() => console.log('Create clicked')}
              >
                <AddIcon size={16} className="mr-2" />
                Create
              </Button>
            </div>
          </div>
          
          {recentAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              id={asset.id}
              type={asset.type}
              icon={ImageIcon}
              name={asset.name}
              url={asset.url}
              isSelected={false}
              onClick={() => console.log('Asset clicked:', asset.name)}
            />
          ))}
        </div>
      </div>

    </div>
  );
} 