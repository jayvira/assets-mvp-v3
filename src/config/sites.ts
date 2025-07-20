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
    name: "Design Resources Hub",
    description: "A curated resource list to kickstart your design education",
    thumbnail: "/images/site1.png",
    status: "live",
    lastModified: "2 hours ago",
    domain: "resources.example.com",
    plan: "E-commerce Site",
    isPublished: true,
  },
  {
    id: "2",
    name: "PlayReplay Tennis",
    description: "No more doubts - Professional tennis coaching platform",
    thumbnail: "/images/site2.png",
    status: "draft",
    lastModified: "1 day ago",
    domain: "tennis.example.com",
    plan: "Basic Site",
    isPublished: false,
  },
  {
    id: "3",
    name: "Blackbird Agency",
    description: "Enter the world of Blackbird - Creative digital agency",
    thumbnail: "/images/site3.png",
    status: "live",
    lastModified: "3 days ago",
    domain: "blackbird.example.com",
    plan: "Business Site",
    isPublished: true,
  },
  {
    id: "4",
    name: "Egglife Wraps",
    description: "The Perfect Wrap for eating better - Healthy food products",
    thumbnail: "/images/site4.png",
    status: "live",
    lastModified: "1 week ago",
    domain: "egglife.example.com",
    plan: "CMS Site",
    isPublished: true,
  },
  {
    id: "5",
    name: "Radiant Search",
    description: "We are Radiant, the leading search to search firm globally",
    thumbnail: "/images/site5.png",
    status: "draft",
    lastModified: "2 weeks ago",
    domain: "radiant.example.com",
    plan: "Starter Site",
    isPublished: false,
  },
  {
    id: "6",
    name: "Pepperclip Studio",
    description: "Creative studio & digital agency based in Paris",
    thumbnail: "/images/site6.png",
    status: "live",
    lastModified: "1 month ago",
    domain: "pepperclip.example.com",
    plan: "Business Site",
    isPublished: true,
  },
  {
    id: "7",
    name: "OpenPhone Teams",
    description: "The all-in-one phone system for teams",
    thumbnail: "/images/site7.png",
    status: "live",
    lastModified: "2 days ago",
    domain: "openphone.example.com",
    plan: "Business Site",
    isPublished: true,
  },
  {
    id: "8",
    name: "Atomus Focus",
    description: "Get your focus back on the experience - Design tool platform",
    thumbnail: "/images/site8.png",
    status: "draft",
    lastModified: "5 days ago",
    domain: "atomus.example.com",
    plan: "Pro Site",
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