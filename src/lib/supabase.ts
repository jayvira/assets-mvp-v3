import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Asset interface to match your database schema
export interface Asset {
  id: number;
  type: string;
  icon: string;
  name: string;
  url: string;
  dateModified: string;
  uploadedDate: string;
  fileSize: string;
  uploadedBy: string;
  tags: string[]; // Convert from string to string array to match original interface
  fileType: string;
  status: string;
  altText: string;
  version: string;
  width: number;
  height: number;
  sites: Array<{
    id: string;
    name: string;
    pages: number;
  }>;
}

// Helper functions to fetch assets
export const getAllAssets = async (): Promise<Asset[]> => {
  const { data, error } = await supabase
    .from('Assets')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching assets:', error)
    return []
  }

  // Transform tags from string to array
  return (data || []).map(asset => ({
    ...asset,
    tags: asset.tags ? asset.tags.split(', ') : []
  }))
}

export const getAssetsForSite = async (siteId: string): Promise<Asset[]> => {
  // Fetch all assets and filter on client side since JSONB queries are tricky
  const { data, error } = await supabase
    .from('Assets')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching assets:', error)
    return []
  }

  // Filter assets by site association
  const filteredAssets = (data || []).filter(asset => 
    asset.sites && asset.sites.some((site: { id: string }) => site.id === siteId)
  )

  console.log(`Assets for site ${siteId}:`, filteredAssets.length);

  // Transform tags from string to array
  return filteredAssets.map(asset => ({
    ...asset,
    tags: asset.tags ? asset.tags.split(', ') : []
  }))
}

export const getAssetById = async (id: number): Promise<Asset | null> => {
  const { data, error } = await supabase
    .from('Assets')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching asset by ID:', error)
    return null
  }



  // Transform tags from string to array
  return data ? {
    ...data,
    tags: data.tags ? data.tags.split(', ') : []
  } : null
}

// Helper function to get asset count for a site
export const getAssetCountForSite = async (siteId: string): Promise<number> => {
  const assets = await getAssetsForSite(siteId);
  return assets.length;
};

// Helper function to get preview images for a site (up to 3)
export const getPreviewImagesForSite = async (siteId: string): Promise<string[]> => {
  const siteAssets = await getAssetsForSite(siteId);
  const images = siteAssets.slice(0, 3).map(asset => asset.url);
  
  // If no assets found, provide fallback images
  if (images.length === 0) {
    return [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop"
    ];
  }
  
  return images;
};

// Optimized function to get asset counts for multiple sites in one query
export const getAssetCountsForSites = async (siteIds: string[]): Promise<Record<string, number>> => {
  try {
    // Get all assets with their site associations
    const { data, error } = await supabase
      .from('Assets')
      .select('id, sites')
      .not('sites', 'is', null);

    if (error) {
      console.error('Error fetching asset counts:', error);
      return {};
    }

    // Count assets per site
    const counts: Record<string, number> = {};
    siteIds.forEach(siteId => counts[siteId] = 0);

    data?.forEach(asset => {
      if (asset.sites) {
        asset.sites.forEach((site: { id: string }) => {
          if (counts.hasOwnProperty(site.id)) {
            counts[site.id]++;
          }
        });
      }
    });

    return counts;
  } catch (error) {
    console.error('Error in getAssetCountsForSites:', error);
    return {};
  }
};

// Optimized function to get preview images for multiple sites in one query
export const getPreviewImagesForSites = async (siteIds: string[]): Promise<Record<string, string[]>> => {
  try {
    // Get all assets with their site associations and URLs
    const { data, error } = await supabase
      .from('Assets')
      .select('id, url, sites')
      .not('sites', 'is', null)
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching preview images:', error);
      return {};
    }

    // Group assets by site and get first 3 URLs
    const siteAssets: Record<string, string[]> = {};
    siteIds.forEach(siteId => siteAssets[siteId] = []);

    data?.forEach(asset => {
      if (asset.sites) {
        asset.sites.forEach((site: { id: string }) => {
          if (siteAssets[site.id] && siteAssets[site.id].length < 3) {
            siteAssets[site.id].push(asset.url);
          }
        });
      }
    });

    // Add fallback images for sites with no assets
    const fallbackImages = [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop"
    ];

    siteIds.forEach(siteId => {
      if (siteAssets[siteId].length === 0) {
        siteAssets[siteId] = [...fallbackImages];
      }
    });

    return siteAssets;
  } catch (error) {
    console.error('Error in getPreviewImagesForSites:', error);
    return {};
  }
};

// Cache for storing fetched data
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cached version of the optimized functions
export const getCachedAssetCountsForSites = async (siteIds: string[]): Promise<Record<string, number>> => {
  const cacheKey = `asset_counts_${siteIds.sort().join('_')}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const data = await getAssetCountsForSites(siteIds);
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
};

export const getCachedPreviewImagesForSites = async (siteIds: string[]): Promise<Record<string, string[]>> => {
  const cacheKey = `preview_images_${siteIds.sort().join('_')}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const data = await getPreviewImagesForSites(siteIds);
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
};

 