// Centralized sites configuration
export interface Site {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  status: 'live' | 'draft';
  lastModified: string;
  domain: string;
  plan: string;
  isPublished: boolean;
}

export const SITES: Site[] = [
  {
    id: "1",
    name: "Forme.com",
    description: "A curated resource list to kickstart your design education",
    thumbnail: "/images/forme-thumbnail.png",
    status: "live",
    lastModified: "2 hours ago",
    domain: "forme.com",
    plan: "CMS Site",
    isPublished: true,
  },
  {
    id: "2",
    name: "Forme Studio Community",
    description: "No more doubts - Professional tennis coaching platform",
    thumbnail: "/images/site2.png",
    status: "draft",
    lastModified: "1 day ago",
    domain: "forme-community.com",
    plan: "Pro Site",
    isPublished: true,
  },
  {
    id: "3",
    name: "Training & Certification",
    description: "Enter the world of Blackbird - Creative digital agency",
    thumbnail: "/images/site3.png",
    status: "live",
    lastModified: "3 days ago",
    domain: "train.forme.com",
    plan: "Business Site",
    isPublished: true,
  },
  {
    id: "4",
    name: "Shop Forme",
    description: "The Perfect Wrap for eating better - Healthy food products",
    thumbnail: "/images/site4.png",
    status: "live",
    lastModified: "1 week ago",
    domain: "shopforme.com",
    plan: "E-commerce Site",
    isPublished: true,
  },
  {
    id: "5",
    name: "Luné Movement",
    description: "We are Radiant, the leading search to search firm globally",
    thumbnail: "/images/site5.png",
    status: "draft",
    lastModified: "2 weeks ago",
    domain: "lune.com",
    plan: "CMS Site",
    isPublished: true,
  },
  {
    id: "6",
    name: "Play Form",
    description: "Creative studio & digital agency based in Paris",
    thumbnail: "/images/site6.png",
    status: "live",
    lastModified: "1 month ago",
    domain: "playform.com",
    plan: "CMS Site",
    isPublished: true,
  },
  {
    id: "7",
    name: "Forme - Brand",
    description: "The all-in-one phone system for teams",
    thumbnail: "/images/site7.png",
    status: "draft",
    lastModified: "2 days ago",
    domain: "forme-brand.com",
    plan: "Starter Site",
    isPublished: false,
  },
  {
    id: "8",
    name: "Forme - Components",
    description: "Get your focus back on the experience - Design tool platform",
    thumbnail: "/images/site8.png",
    status: "draft",
    lastModified: "5 days ago",
    domain: "forme-components.com",
    plan: "Starter Site",
    isPublished: false,
  },
];

// Helper function to get site by ID
export const getSiteById = (id: string): Site | undefined => {
  return SITES.find(site => site.id === id);
};

// Helper function to get site name by ID
export const getSiteNameById = (id: string): string => {
  const site = getSiteById(id);
  return site?.name || 'Unknown Site';
};

// Helper function to get all sites for filtering
export const getAllSites = (): { id: string; name: string }[] => {
  return SITES.map(site => ({ id: site.id, name: site.name }));
}; 