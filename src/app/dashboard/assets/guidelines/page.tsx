'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AssetCard from '@/components/designer/layout/panels/leftpanel/AssetCard';
import ColorCard from '@/components/dashboard/color-card';
import ColorPickerCard from '@/components/dashboard/color-picker-card';
import TypographyCard from '@/components/dashboard/typography-card';
import { Table, TableHeader, TableRow, TableCell } from '@/components/spring-ui/table';
import { ImageIcon, UploadIcon, AddIcon } from '@/icons';
import { Button } from '@/components/spring-ui/button';
import { AIOptimizeIcon } from '@/icons/AIOptimizeIcon';
import { getAllAssets } from '@/lib/supabase';

export default function BrandGuidelinesPage() {
  const router = useRouter();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch assets from Supabase
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const allAssets = await getAllAssets();
        setAssets(allAssets);
      } catch (error) {
        console.error('Error fetching assets:', error);
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  // Filter assets to only show those with "logo" tag, limit to 5
  const logoAssets = assets.filter((asset: any) => 
    asset.tags && asset.tags.includes("logo")
  ).slice(0, 5);

  // Filter assets to only show those with "icon" tag, limit to 5
  const iconAssets = assets.filter((asset: any) => 
    asset.tags && asset.tags.includes("icon")
  ).slice(0, 5);

  const colorPalette = [
    { color: '#1A67EA', hexCode: '#1A67EA' },
    { color: '#FFFFFF', hexCode: '#FFFFFF' },
    { color: '#000000', hexCode: '#000000' },
    { color: '#F59E0B', hexCode: '#F59E0B' },
    { color: '#10B981', hexCode: '#10B981' },
    { color: '#EF4444', hexCode: '#EF4444' },
  ];

  const typographyStyles = [
    'Title',
    'Heading - H1',
    'Heading - H2',
    'Heading - H3',
    'Heading - H4',
    'Body',
    'Quote',
    'Caption'
  ];

  const librariesData = [
    {
      name: 'Brand Boilerplate Components',
      components: 16,
      variables: 70,
      assets: 18,
      lastUpdated: 'Jul 15, 2025',
      lastUpdatedBy: 'John Smith',
      installations: 39,
      autoInstall: false
    },
    {
      name: 'Catalyst Shared Library',
      components: 18,
      variables: 46,
      assets: 60,
      lastUpdated: 'Mar 11, 2025',
      lastUpdatedBy: 'Mike Johnson',
      installations: 1,
      autoInstall: false
    },
    {
      name: 'Pagebuilding component library test',
      components: 1,
      variables: 0,
      assets: 4,
      lastUpdated: 'Feb 26, 2025',
      lastUpdatedBy: 'Mike Johnson',
      installations: null,
      autoInstall: false
    }
  ];

  const templatesData = [
    {
      name: 'Boilerplate Framework',
      installations: 1,
      createdOn: 'Jun 24, 2024 at 6:51 PM'
    }
  ];

  return (
    <div className="p-6 space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">Brand Guidelines</h1>
          <p className="text-[var(--text-secondary)]">Manage your brand assets, logos, colors, and design system.</p>
        </div>
        <Button
          variant="primary"
          size="compact"
          onClick={() => console.log('Auto-import clicked')}
        >
          <AIOptimizeIcon size={16} className="mr-2" />
          Auto-import
        </Button>
      </div>
      


      {/* Recently Added Assets Section */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Logos</h3>
          <Button
            variant="outline"
            size="compact"
            onClick={() => console.log('Add new clicked')}
          >
            <AddIcon size={16} className="mr-2" />
            Add new
          </Button>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {logoAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              id={asset.id}
              type={asset.type}
              icon={ImageIcon}
              name={asset.name}
              url={asset.url}
              isSelected={false}
              selectable={false}
              onClick={() => console.log('Asset clicked:', asset.name)}
            />
          ))}
        </div>
      </div>

      {/* Color Palette Section */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Color Palette</h3>
        </div>
        <div className="flex flex-row gap-16">
          {colorPalette.map((color, index) => (
            <ColorCard
              key={index}
              color={color.color}
              hexCode={color.hexCode}
              onClick={() => console.log('Color clicked:', color.hexCode)}
            />
          ))}
          <ColorPickerCard
            onClick={() => console.log('Add new color clicked')}
          />
        </div>
      </div>

      {/* Typography Section */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Typography</h3>
          <Button
            variant="outline"
            size="compact"
            onClick={() => console.log('Add new typography clicked')}
          >
            <AddIcon size={16} className="mr-2" />
            Add new
          </Button>
        </div>
        <div className="space-y-3">
          {typographyStyles.map((style, index) => (
            <TypographyCard
              key={index}
              textStyle={style}
              onClick={() => console.log('Typography style clicked:', style)}
              onEdit={() => console.log('Edit typography style:', style)}
              onDelete={() => console.log('Delete typography style:', style)}
            />
          ))}
        </div>
      </div>

      {/* Icons Section */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Icons</h3>
          <Button
            variant="outline"
            size="compact"
            onClick={() => console.log('Add new clicked')}
          >
            <AddIcon size={16} className="mr-2" />
            Add new
          </Button>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {iconAssets.map((asset) => (
            <AssetCard
              key={`icons-${asset.id}`}
              id={asset.id}
              type={asset.type}
              icon={ImageIcon}
              name={asset.name}
              url={asset.url}
              isSelected={false}
              selectable={false}
              onClick={() => console.log('Asset clicked:', asset.name)}
            />
          ))}
        </div>
      </div>

      {/* Libraries Section */}
      <div className="pt-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Libraries</h3>
          <p className="text-[var(--text-secondary)]">Libraries let you share components, variables, and assets across multiple sites in your Workspace.</p>
        </div>
        
        <Table>
          <TableHeader
            columns={[
              { id: 'name', header: 'Name', width: '30%' },
              { id: 'resources', header: 'Resources', width: '25%' },
              { id: 'lastUpdated', header: 'Last updated', width: '20%' },
              { id: 'installations', header: 'Installations', width: '15%' },
              { id: 'autoInstall', header: 'Auto-install', width: '10%' },
              { id: 'actions', header: '', width: '5%' }
            ]}
          />
          {librariesData.map((library, index) => {
            const columns = [
              { id: 'name', header: 'Name', width: '30%' },
              { id: 'resources', header: 'Resources', width: '25%' },
              { id: 'lastUpdated', header: 'Last updated', width: '20%' },
              { id: 'installations', header: 'Installations', width: '15%' },
              { id: 'autoInstall', header: 'Auto-install', width: '10%' },
              { id: 'actions', header: '', width: '5%' }
            ];
            
            return (
              <TableRow key={index} data={library} columns={columns}>
                <TableCell>{library.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-[var(--text-blue)] rounded-sm"></div>
                      <span className="text-sm">{library.components} components</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-[var(--text-green)] rounded-sm"></div>
                      <span className="text-sm">{library.variables} variables</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-[var(--text-orange)] rounded-sm"></div>
                      <span className="text-sm">{library.assets} assets</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[var(--text-blue)] rounded-full"></div>
                    <span className="text-sm">{library.lastUpdated}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {library.installations ? (
                      <>
                        <span className="text-sm underline text-[var(--text-blue)] cursor-pointer">
                          {library.installations} sites
                        </span>
                        <Button variant="outline" size="compact" className="text-xs">
                          Updates
                        </Button>
                      </>
                    ) : (
                      <span className="text-sm text-[var(--text-secondary)]">—</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">Off</span>
                    <div className="w-4 h-4 bg-[var(--text-secondary)] rounded-sm opacity-50"></div>
                  </div>
                </TableCell>
                <TableCell>
                  <button className="p-1 hover:bg-[var(--background-secondary)] rounded">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="1" fill="currentColor"/>
                      <circle cx="6" cy="12" r="1" fill="currentColor"/>
                      <circle cx="18" cy="12" r="1" fill="currentColor"/>
                    </svg>
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      </div>

      {/* Templates Section */}
      <div className="pt-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Templates</h3>
        </div>
        
        <Table>
          <TableHeader
            columns={[
              { id: 'name', header: 'Name', width: '40%' },
              { id: 'installations', header: 'Installations', width: '30%' },
              { id: 'createdOn', header: 'Created on', width: '30%' }
            ]}
          />
          {templatesData.map((template, index) => {
            const columns = [
              { id: 'name', header: 'Name', width: '40%' },
              { id: 'installations', header: 'Installations', width: '30%' },
              { id: 'createdOn', header: 'Created on', width: '30%' }
            ];
            
            return (
              <TableRow key={index} data={template} columns={columns}>
                <TableCell>{template.name}</TableCell>
                <TableCell>
                  <span className="text-sm">{template.installations} site</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{template.createdOn}</span>
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      </div>
    </div>
  );
} 