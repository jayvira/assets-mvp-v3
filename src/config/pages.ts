// Page item interface
export interface PageItem {
  name: string;
  path: string;
  icon?: string;
  children?: PageItem[];
  draft?: boolean;
}

// Section interface
export interface PageSection {
  title: string;
  items: PageItem[];
  expanded: boolean;
}

// Site pages configuration
export const SITE_PAGES: PageSection[] = [
  {
    title: 'Static pages',
    expanded: true,
    items: [
      { name: 'Home', path: '/' },
      { name: 'Contact Us', path: '/contact' },
      { name: '[Draft] Styles', path: '/styles', draft: true },
      { name: 'Fall Refresh Campaign', path: '/fall-refresh-campaign' }
    ]
  },
  {
    title: 'CMS Collection pages',
    expanded: true,
    items: [
      { name: 'Testimonials Template', path: '/testimonials' }
    ]
  },
  {
    title: 'Utility pages',
    expanded: true,
    items: [
      { name: 'Password', path: '/password' },
      { name: '404', path: '/404' }
    ]
  },
  {
    title: 'Static page templates',
    expanded: false,
    items: []
  },
  {
    title: 'Ecommerce pages',
    expanded: false,
    items: []
  },
  {
    title: 'User pages',
    expanded: false,
    items: []
  }
];

// Helper function to get all pages from all sections
export const getAllPages = (): PageItem[] => {
  return SITE_PAGES.flatMap(section => section.items);
};

// Helper function to get pages by section
export const getPagesBySection = (sectionTitle: string): PageItem[] => {
  const section = SITE_PAGES.find(section => section.title === sectionTitle);
  return section?.items || [];
};

// Helper function to search pages
export const searchPages = (query: string): PageItem[] => {
  const allPages = getAllPages();
  const lowercaseQuery = query.toLowerCase();
  
  return allPages.filter(page => 
    page.name.toLowerCase().includes(lowercaseQuery) ||
    page.path.toLowerCase().includes(lowercaseQuery)
  );
}; 