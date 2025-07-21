// Centralized assets configuration
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
  tags: string[];
  fileType: string;
  status: string;
  altText: string;
  version: string;
  sites: Array<{
    id: string;
    name: string;
    pages: number;
  }>;
  width: number;
  height: number;
}

// Helper function to get site name by ID (imported from sites config)
import { getSiteNameById } from './sites';

// Centralized assets data
export const ASSETS: Asset[] = [
  {
    id: 1,
    type: "JPG",
    icon: "ImageIcon",
    name: "Studio Entry",
    url: "https://cdn.prod.website-files.com/687d379371b4f02fa4f58460/687d38bd3a0830c27e75f6ff_80dcae61-404f-4f22-a9da-9085b6dc9dae.avif",
    dateModified: "2024-06-10T10:00:00Z",
    uploadedDate: "2024-06-10T10:00:00Z",
    fileSize: "2.4 MB",
    uploadedBy: "Sarah Johnson",
    tags: ["team", "collaboration", "working"],
    fileType: "Images",
    status: "Approved",
    altText: "Team collaboration meeting with people working together",
    version: "V1",
    sites: [
      { id: "1", name: getSiteNameById("1"), pages: 3 },
      { id: "7", name: getSiteNameById("7"), pages: 2 },
      { id: "8", name: getSiteNameById("8"), pages: 1 }
    ],
    width: 3200,
    height: 2400,
  },
  {
    id: 2,
    type: "JPG",
    icon: "ImageIcon",
    name: "dashboard-preview-light",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    dateModified: "2024-06-12T09:00:00Z",
    uploadedDate: "2024-06-12T09:00:00Z",
    fileSize: "1.8 MB",
    uploadedBy: "Mike Chen",
    tags: ["dashboard", "analytics"],
    fileType: "Images",
    status: "Needs Edit",
    altText: "Modern dashboard interface with charts and data visualization",
    version: "V1",
    sites: [
      { id: "2", name: getSiteNameById("2"), pages: 1 },
      { id: "5", name: getSiteNameById("5"), pages: 2 }
    ],
    width: 1920,
    height: 1080,
  },
  {
    id: 3,
    type: "PNG",
    icon: "ImageIcon",
    name: "office-building",
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    dateModified: "2024-06-09T08:00:00Z",
    uploadedDate: "2024-06-09T08:00:00Z",
    fileSize: "3.2 MB",
    uploadedBy: "Emily Rodriguez",
    tags: ["office", "building"],
    fileType: "Images",
    status: "In Progress",
    altText: "Modern office building with glass facade",
    version: "V1",
    sites: [
      { id: "3", name: getSiteNameById("3"), pages: 2 },
      { id: "6", name: getSiteNameById("6"), pages: 1 }
    ],
    width: 3197,
    height: 3912,
  },
  {
    id: 4,
    type: "PNG",
    icon: "ImageIcon",
    name: "customer-bio",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    dateModified: "2024-06-11T12:00:00Z",
    uploadedDate: "2024-06-11T12:00:00Z",
    fileSize: "1.5 MB",
    uploadedBy: "David Kim",
    tags: ["portrait", "professional"],
    fileType: "Images",
    status: "Needs Review",
    altText: "Professional headshot portrait for customer bio",
    version: "V1",
    sites: [
      { id: "4", name: getSiteNameById("4"), pages: 1 }
    ],
    width: 1200,
    height: 1600,
  },
  {
    id: 5,
    type: "AVIF",
    icon: "ImageIcon",
    name: "Abstract Flower",
    url: "https://images.unsplash.com/photo-1597956525770-3e68f519c032?w=800&h=600&fit=crop",
    dateModified: "2024-06-08T14:00:00Z",
    uploadedDate: "2024-06-08T14:00:00Z",
    fileSize: "856 KB",
    uploadedBy: "Lisa Wang",
    tags: ["flower", "abstract"],
    fileType: "Illustrator & Vector Graphics",
    status: "No status",
    altText: "Abstract artistic representation of a flower with geometric patterns",
    version: "V1",
    sites: [
      { id: "6", name: getSiteNameById("6"), pages: 1 }
    ],
    width: 2048,
    height: 2048,
  },
  {
    id: 6,
    type: "JPG",
    icon: "ImageIcon",
    name: "hero-gradient-background",
    url: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=600&fit=crop",
    dateModified: "2024-06-07T16:00:00Z",
    uploadedDate: "2024-06-07T16:00:00Z",
    fileSize: "2.1 MB",
    uploadedBy: "Alex Thompson",
    tags: ["gradient", "background"],
    fileType: "Images",
    status: "Approved",
    altText: "Colorful gradient background suitable for hero sections",
    version: "V1",
    sites: [
      { id: "1", name: getSiteNameById("1"), pages: 2 },
      { id: "7", name: getSiteNameById("7"), pages: 1 },
      { id: "8", name: getSiteNameById("8"), pages: 1 }
    ],
    width: 2560,
    height: 1440,
  },
  {
    id: 7,
    type: "PNG",
    icon: "ImageIcon",
    name: "team-brainstorming-session",
    url: "https://cdn.prod.website-files.com/68073d50f72fc4822d5b8250/6840f45281c301901ac47e6d_Service%20Image%202.avif",
    dateModified: "2024-06-06T18:00:00Z",
    uploadedDate: "2024-06-06T18:00:00Z",
    fileSize: "4.2 MB",
    uploadedBy: "Rachel Green",
    tags: ["team", "brainstorming"],
    fileType: "Images",
    status: "Approved",
    altText: "Team brainstorming session with people discussing ideas",
    version: "V1",
    sites: [
      { id: "8", name: getSiteNameById("8"), pages: 1 }
    ],
    width: 3000,
    height: 2000,
  },
  {
    id: 8,
    type: "JPG",
    icon: "ImageIcon",
    name: "charts",
    url: "https://cdn.prod.website-files.com/67b6301bb1ab17fd037264d3/67b6301bb1ab17fd0372662c_torch-product-image-2.avif",
    dateModified: "2024-06-05T20:00:00Z",
    uploadedDate: "2024-06-05T20:00:00Z",
    fileSize: "1.9 MB",
    uploadedBy: "Tom Wilson",
    tags: ["award", "badge"],
    fileType: "Images",
    status: "Needs Edit",
    altText: "Award badge or trophy for recognition",
    version: "V1",
    sites: [
      { id: "2", name: getSiteNameById("2"), pages: 1 },
      { id: "5", name: getSiteNameById("5"), pages: 1 }
    ],
    width: 1600,
    height: 1200,
  },
  {
    id: 9,
    type: "AVIF",
    icon: "ImageIcon",
    name: "webinar-thumbnail-product-tour",
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
    dateModified: "2024-06-04T22:00:00Z",
    uploadedDate: "2024-06-04T22:00:00Z",
    fileSize: "1.3 MB",
    uploadedBy: "Jessica Lee",
    tags: ["webinar", "product"],
    fileType: "Images",
    status: "Needs Review",
    altText: "Webinar thumbnail showing product tour presentation",
    version: "V1",
    sites: [
      { id: "7", name: getSiteNameById("7"), pages: 1 }
    ],
    width: 1280,
    height: 720,
  },
  {
    id: 10,
    type: "PNG",
    icon: "ImageIcon",
    name: "newsletter-signup-banner",
    url: "https://cdn.prod.website-files.com/687d379371b4f02fa4f58460/687d38bcd86e6514b716fd4f_27c79418-d0e9-48d1-b03e-3a7c62a73501.avif",
    dateModified: "2024-06-03T23:00:00Z",
    uploadedDate: "2024-06-03T23:00:00Z",
    fileSize: "2.7 MB",
    uploadedBy: "Kevin Martinez",
    tags: ["newsletter", "signup"],
    fileType: "Images",
    status: "Approved",
    altText: "Newsletter signup banner with call-to-action",
    version: "V1",
    sites: [
      { id: "1", name: getSiteNameById("1"), pages: 1 }
    ],
    width: 1920,
    height: 600,
  },
  {
    id: 11,
    type: "MP4",
    icon: "VideoIcon",
    name: "product-demo-video",
    url: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=600&fit=crop",
    dateModified: "2024-06-02T15:00:00Z",
    uploadedDate: "2024-06-02T15:00:00Z",
    fileSize: "15.2 MB",
    uploadedBy: "Maria Garcia",
    tags: ["product", "demo", "video"],
    fileType: "Videos",
    status: "Approved",
    altText: "Product demonstration video showing key features",
    version: "V1",
    sites: [
      { id: "3", name: getSiteNameById("3"), pages: 1 },
      { id: "6", name: getSiteNameById("6"), pages: 1 }
    ],
    width: 1920,
    height: 1080,
  },
  {
    id: 12,
    type: "PDF",
    icon: "MainDocsIcon",
    name: "user-manual-guide",
    url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop",
    dateModified: "2024-06-01T11:00:00Z",
    uploadedDate: "2024-06-01T11:00:00Z",
    fileSize: "2.8 MB",
    uploadedBy: "Robert Chen",
    tags: ["manual", "guide", "documentation"],
    fileType: "Documents",
    status: "Needs Review",
    altText: "User manual and guide documentation",
    version: "V1",
    sites: [
      { id: "4", name: getSiteNameById("4"), pages: 1 },
      { id: "7", name: getSiteNameById("7"), pages: 1 }
    ],
    width: 0,
    height: 0,
  },
  {
    id: 13,
    type: "SVG",
    icon: "ImageIcon",
    name: "company-logo-vector",
    url: "https://cdn.prod.website-files.com/687d379371b4f02fa4f58460/687d50a3da6b5e7dac751d43_forme_logo-black.svg",
    dateModified: "2024-05-31T14:00:00Z",
    uploadedDate: "2024-05-31T14:00:00Z",
    fileSize: "156 KB",
    uploadedBy: "Sophie Turner",
    tags: ["logo", "brand", "vector"],
    fileType: "Illustrator & Vector Graphics",
    status: "Approved",
    altText: "Company logo in vector format",
    version: "V1",
    sites: [
      { id: "1", name: getSiteNameById("1"), pages: 1 },
      { id: "2", name: getSiteNameById("2"), pages: 1 },
      { id: "5", name: getSiteNameById("5"), pages: 1 }
    ],
    width: 500,
    height: 200,
  },
  {
    id: 14,
    type: "JPG",
    icon: "ImageIcon",
    name: "team-photo-2024",
    url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop",
    dateModified: "2024-05-30T09:00:00Z",
    uploadedDate: "2024-05-30T09:00:00Z",
    fileSize: "3.5 MB",
    uploadedBy: "James Wilson",
    tags: ["team", "photo", "2024"],
    fileType: "Images",
    status: "Approved",
    altText: "Team photo from 2024 company event",
    version: "V1",
    sites: [
      { id: "8", name: getSiteNameById("8"), pages: 1 }
    ],
    width: 4000,
    height: 3000,
  },
  {
    id: 15,
    type: "PNG",
    icon: "ImageIcon",
    name: "app-screenshot-mobile",
    url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
    dateModified: "2024-05-29T16:00:00Z",
    uploadedDate: "2024-05-29T16:00:00Z",
    fileSize: "1.2 MB",
    uploadedBy: "Emma Davis",
    tags: ["mobile", "app", "screenshot"],
    fileType: "Images",
    status: "Needs Edit",
    altText: "Mobile app screenshot for marketing materials",
    version: "V1",
    sites: [
      { id: "2", name: getSiteNameById("2"), pages: 1 },
      { id: "6", name: getSiteNameById("6"), pages: 1 }
    ],
    width: 750,
    height: 1334,
  },
  {
    id: 16,
    type: "SVG",
    icon: "ImageIcon",
    name: "primary-logo",
    url: "https://cdn.prod.website-files.com/687d379371b4f02fa4f58460/687d512966e676495bc5b407_forme_logo-wordmark-black.svg",
    dateModified: "2024-06-13T10:00:00Z",
    uploadedDate: "2024-06-13T10:00:00Z",
    fileSize: "45 KB",
    uploadedBy: "Design Team",
    tags: ["logo", "primary", "brand"],
    fileType: "Illustrator & Vector Graphics",
    status: "Approved",
    altText: "Primary company logo in vector format",
    version: "V1",
    sites: [
      { id: "1", name: getSiteNameById("1"), pages: 1 },
      { id: "2", name: getSiteNameById("2"), pages: 1 },
      { id: "3", name: getSiteNameById("3"), pages: 1 }
    ],
    width: 500,
    height: 200,
  },
  {
    id: 17,
    type: "PNG",
    icon: "ImageIcon",
    name: "secondary-logo",
    url: "https://cdn.prod.website-files.com/6363069607e7999b6a2dd42f/6363069607e799fdc12ddbff_users.svg",
    dateModified: "2024-06-12T15:30:00Z",
    uploadedDate: "2024-06-12T15:30:00Z",
    fileSize: "78 KB",
    uploadedBy: "Brand Manager",
    tags: ["logo", "secondary", "brand"],
    fileType: "Illustrator & Vector Graphics",
    status: "Approved",
    altText: "Secondary company logo for alternative use",
    version: "V1",
    sites: [
      { id: "4", name: getSiteNameById("4"), pages: 1 },
      { id: "5", name: getSiteNameById("5"), pages: 1 }
    ],
    width: 400,
    height: 150,
  },
  {
    id: 18,
    type: "SVG",
    icon: "ImageIcon",
    name: "icon-logo",
    url: "https://cdn.prod.website-files.com/6363069607e7999b6a2dd42f/6363069607e799fdc12ddbff_users.svg",
    dateModified: "2024-06-11T09:15:00Z",
    uploadedDate: "2024-06-11T09:15:00Z",
    fileSize: "32 KB",
    uploadedBy: "UI Designer",
    tags: ["logo", "icon", "favicon"],
    fileType: "Illustrator & Vector Graphics",
    status: "Approved",
    altText: "Icon version of company logo for favicon and small use",
    version: "V1",
    sites: [
      { id: "1", name: getSiteNameById("1"), pages: 1 },
      { id: "7", name: getSiteNameById("7"), pages: 1 },
      { id: "8", name: getSiteNameById("8"), pages: 1 }
    ],
    width: 256,
    height: 256,
  },
  {
    id: 19,
    type: "PNG",
    icon: "ImageIcon",
    name: "white-logo",
    url: "https://cdn.prod.website-files.com/6363069607e7999b6a2dd42f/6363069607e799fdc12ddbff_users.svg",
    dateModified: "2024-06-10T14:45:00Z",
    uploadedDate: "2024-06-10T14:45:00Z",
    fileSize: "67 KB",
    uploadedBy: "Creative Director",
    tags: ["logo", "white", "dark-background"],
    fileType: "Illustrator & Vector Graphics",
    status: "Approved",
    altText: "White version of company logo for dark backgrounds",
    version: "V1",
    sites: [
      { id: "2", name: getSiteNameById("2"), pages: 1 },
      { id: "6", name: getSiteNameById("6"), pages: 1 }
    ],
    width: 500,
    height: 200,
  },
  {
    id: 20,
    type: "SVG",
    icon: "ImageIcon",
    name: "monochrome-logo",
    url: "https://cdn.prod.website-files.com/6363069607e7999b6a2dd42f/6363069607e799fdc12ddbff_users.svg",
    dateModified: "2024-06-09T11:20:00Z",
    uploadedDate: "2024-06-09T11:20:00Z",
    fileSize: "28 KB",
    uploadedBy: "Brand Specialist",
    tags: ["logo", "monochrome", "minimal"],
    fileType: "Illustrator & Vector Graphics",
    status: "Approved",
    altText: "Monochrome version of company logo for minimal designs",
    version: "V1",
    sites: [
      { id: "3", name: getSiteNameById("3"), pages: 1 },
      { id: "4", name: getSiteNameById("4"), pages: 1 },
      { id: "7", name: getSiteNameById("7"), pages: 1 }
    ],
    width: 400,
    height: 150,
  },
  {
    id: 21,
    type: "SVG",
    icon: "ImageIcon",
    name: "home-icon",
    url: "https://cdn.prod.website-files.com/6363069607e7999b6a2dd42f/6363069607e799fdc12ddbff_users.svg",
    dateModified: "2024-06-14T08:00:00Z",
    uploadedDate: "2024-06-14T08:00:00Z",
    fileSize: "12 KB",
    uploadedBy: "UI Designer",
    tags: ["icon", "home", "navigation"],
    fileType: "Illustrator & Vector Graphics",
    status: "Approved",
    altText: "Home navigation icon for website menus",
    version: "V1",
    sites: [
      { id: "1", name: getSiteNameById("1"), pages: 1 },
      { id: "2", name: getSiteNameById("2"), pages: 1 }
    ],
    width: 64,
    height: 64,
  },
  {
    id: 22,
    type: "SVG",
    icon: "ImageIcon",
    name: "user-icon",
    url: "https://cdn.prod.website-files.com/6363069607e7999b6a2dd42f/6363069607e799fdc12ddbff_users.svg",
    dateModified: "2024-06-13T14:30:00Z",
    uploadedDate: "2024-06-13T14:30:00Z",
    fileSize: "8 KB",
    uploadedBy: "UX Designer",
    tags: ["icon", "user", "profile"],
    fileType: "Illustrator & Vector Graphics",
    status: "Approved",
    altText: "User profile icon for account sections",
    version: "V1",
    sites: [
      { id: "3", name: getSiteNameById("3"), pages: 1 },
      { id: "4", name: getSiteNameById("4"), pages: 1 }
    ],
    width: 48,
    height: 48,
  },
  {
    id: 23,
    type: "SVG",
    icon: "ImageIcon",
    name: "search-icon",
    url: "https://cdn.prod.website-files.com/6363069607e7999b6a2dd42f/6363069607e799fdc12ddbff_users.svg",
    dateModified: "2024-06-12T11:45:00Z",
    uploadedDate: "2024-06-12T11:45:00Z",
    fileSize: "6 KB",
    uploadedBy: "Frontend Developer",
    tags: ["icon", "search", "magnifying-glass"],
    fileType: "Illustrator & Vector Graphics",
    status: "Approved",
    altText: "Search magnifying glass icon for search functionality",
    version: "V1",
    sites: [
      { id: "5", name: getSiteNameById("5"), pages: 1 },
      { id: "6", name: getSiteNameById("6"), pages: 1 }
    ],
    width: 32,
    height: 32,
  },
  {
    id: 24,
    type: "SVG",
    icon: "ImageIcon",
    name: "settings-icon",
    url: "https://cdn.prod.website-files.com/6363069607e7999b6a2dd42f/6363069607e799fdc12ddbff_users.svg",
    dateModified: "2024-06-11T16:20:00Z",
    uploadedDate: "2024-06-11T16:20:00Z",
    fileSize: "10 KB",
    uploadedBy: "UI Designer",
    tags: ["icon", "settings", "gear"],
    fileType: "Illustrator & Vector Graphics",
    status: "Approved",
    altText: "Settings gear icon for configuration menus",
    version: "V1",
    sites: [
      { id: "7", name: getSiteNameById("7"), pages: 1 },
      { id: "8", name: getSiteNameById("8"), pages: 1 }
    ],
    width: 40,
    height: 40,
  },
  {
    id: 25,
    type: "SVG",
    icon: "ImageIcon",
    name: "download-icon",
    url: "https://cdn.prod.website-files.com/6363069607e7999b6a2dd42f/6363069607e799fdc12ddbff_users.svg",
    dateModified: "2024-06-10T13:15:00Z",
    uploadedDate: "2024-06-10T13:15:00Z",
    fileSize: "7 KB",
    uploadedBy: "UX Designer",
    tags: ["icon", "download", "arrow"],
    fileType: "Illustrator & Vector Graphics",
    status: "Approved",
    altText: "Download arrow icon for file downloads",
    version: "V1",
    sites: [
      { id: "1", name: getSiteNameById("1"), pages: 1 },
      { id: "5", name: getSiteNameById("5"), pages: 1 }
    ],
    width: 36,
    height: 36,
  },
  {
    id: 26,
    type: "SVG",
    icon: "ImageIcon",
    name: "menu-icon",
    url: "https://cdn.prod.website-files.com/6363069607e7999b6a2dd42f/6363069607e799fdc12ddbff_users.svg",
    dateModified: "2024-06-09T10:45:00Z",
    uploadedDate: "2024-06-09T10:45:00Z",
    fileSize: "5 KB",
    uploadedBy: "Mobile Developer",
    tags: ["icon", "menu", "hamburger"],
    fileType: "Illustrator & Vector Graphics",
    status: "Approved",
    altText: "Hamburger menu icon for mobile navigation",
    version: "V1",
    sites: [
      { id: "2", name: getSiteNameById("2"), pages: 1 },
      { id: "6", name: getSiteNameById("6"), pages: 1 }
    ],
    width: 24,
    height: 24,
  },
  {
    id: 27,
    type: "SVG",
    icon: "ImageIcon",
    name: "close-icon",
    url: "https://cdn.prod.website-files.com/6363069607e7999b6a2dd42f/6363069607e799fdc12ddbff_users.svg",
    dateModified: "2024-06-08T15:30:00Z",
    uploadedDate: "2024-06-08T15:30:00Z",
    fileSize: "4 KB",
    uploadedBy: "UI Designer",
    tags: ["icon", "close", "x"],
    fileType: "Illustrator & Vector Graphics",
    status: "Approved",
    altText: "Close X icon for modal and popup dismissals",
    version: "V1",
    sites: [
      { id: "3", name: getSiteNameById("3"), pages: 1 },
      { id: "4", name: getSiteNameById("4"), pages: 1 }
    ],
    width: 20,
    height: 20,
  },
  {
    id: 28,
    type: "SVG",
    icon: "ImageIcon",
    name: "heart-icon",
    url: "https://cdn.prod.website-files.com/6363069607e7999b6a2dd42f/6363069607e799fdc12ddbff_users.svg",
    dateModified: "2024-06-07T12:00:00Z",
    uploadedDate: "2024-06-07T12:00:00Z",
    fileSize: "9 KB",
    uploadedBy: "UI Designer",
    tags: ["icon", "heart", "like", "favorite"],
    fileType: "Illustrator & Vector Graphics",
    status: "Approved",
    altText: "Heart icon for like and favorite functionality",
    version: "V1",
    sites: [
      { id: "5", name: getSiteNameById("5"), pages: 1 },
      { id: "7", name: getSiteNameById("7"), pages: 1 }
    ],
    width: 28,
    height: 28,
  },
  {
    id: 29,
    type: "AVIF",
    icon: "ImageIcon",
    name: "fall-refresh-campaign-hero",
    url: "https://cdn.prod.website-files.com/687d379371b4f02fa4f58460/687d7527c74d8c88972c8c49_pilates-class-fall.jpg",
    dateModified: "2024-06-15T10:00:00Z",
    uploadedDate: "2024-06-15T10:00:00Z",
    fileSize: "1.2 MB",
    uploadedBy: "Marketing Team",
    tags: ["fall refresh campaign", "hero", "fitness"],
    fileType: "Images",
    status: "Approved",
    altText: "Fall refresh campaign hero image featuring fitness and wellness",
    version: "V1",
    sites: [
      { id: "1", name: getSiteNameById("1"), pages: 1 }
    ],
    width: 1920,
    height: 1080,
  },
  {
    id: 30,
    type: "AVIF",
    icon: "ImageIcon",
    name: "fall-refresh-campaign-pilates",
    url: "https://cdn.prod.website-files.com/687d379371b4f02fa4f58460/687d38bd52cb2fc875579ba4_6e6861d3-6759-4590-9657-005df1b9ed2b.avif",
    dateModified: "2024-06-15T10:00:00Z",
    uploadedDate: "2024-06-15T10:00:00Z",
    fileSize: "1.2 MB",
    uploadedBy: "Marketing Team",
    tags: ["fall refresh campaign", "pilates", "fitness"],
    fileType: "Images",
    status: "Approved",
    altText: "Fall refresh campaign pilates class image",
    version: "V1",
    sites: [
      { id: "1", name: getSiteNameById("1"), pages: 1 }
    ],
    width: 1920,
    height: 1080,
  },
  {
    id: 31,
    type: "AVIF",
    icon: "ImageIcon",
    name: "fall-refresh-campaign-strength",
    url: "https://cdn.prod.website-files.com/687d379371b4f02fa4f58460/687d38bdc698a94826c37dff_06cd005e-4e16-4f46-9a92-8153830eb96a.avif",
    dateModified: "2024-06-15T10:00:00Z",
    uploadedDate: "2024-06-15T10:00:00Z",
    fileSize: "1.2 MB",
    uploadedBy: "Marketing Team",
    tags: ["fall refresh campaign", "strength", "fitness"],
    fileType: "Images",
    status: "Approved",
    altText: "Fall refresh campaign strength training image",
    version: "V1",
    sites: [
      { id: "1", name: getSiteNameById("1"), pages: 1 }
    ],
    width: 1920,
    height: 1080,
  },
  {
    id: 32,
    type: "AVIF",
    icon: "ImageIcon",
    name: "fall-refresh-campaign-mindfulness",
    url: "https://cdn.prod.website-files.com/687d379371b4f02fa4f58460/687d38bc178eedd903e6fc87_f2ee0de4-cd1d-4b8e-8362-add806621ee1.avif",
    dateModified: "2024-06-15T10:00:00Z",
    uploadedDate: "2024-06-15T10:00:00Z",
    fileSize: "1.2 MB",
    uploadedBy: "Marketing Team",
    tags: ["fall refresh campaign", "mindfulness", "fitness"],
    fileType: "Images",
    status: "Approved",
    altText: "Fall refresh campaign mindfulness and wellness image",
    version: "V1",
    sites: [
      { id: "1", name: getSiteNameById("1"), pages: 1 }
    ],
    width: 1920,
    height: 1080,
  },
  {
    id: 33,
    type: "AVIF",
    icon: "ImageIcon",
    name: "fall-refresh-campaign-community",
    url: "https://images.unsplash.com/photo-1611077094679-97c56013ddd3?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dateModified: "2024-06-15T10:00:00Z",
    uploadedDate: "2024-06-15T10:00:00Z",
    fileSize: "1.2 MB",
    uploadedBy: "Marketing Team",
    tags: ["fall refresh campaign", "community", "fitness"],
    fileType: "Images",
    status: "Approved",
    altText: "Fall refresh campaign community studio image",
    version: "V1",
    sites: [
      { id: "1", name: getSiteNameById("1"), pages: 1 }
    ],
    width: 1920,
    height: 1080,
  },
];

// Helper function to get asset by ID
export const getAssetById = (id: number): Asset | undefined => {
  return ASSETS.find(asset => asset.id === id);
};

// Helper function to get asset name by ID
export const getAssetNameById = (id: number): string => {
  const asset = getAssetById(id);
  return asset?.name || 'Unknown Asset';
};

// Helper function to get all assets
export const getAllAssets = (): Asset[] => {
  return ASSETS;
};

// Helper function to get assets for a specific site
export const getAssetsForSite = (siteId: string): Asset[] => {
  return ASSETS.filter(asset => 
    asset.sites?.some(site => site.id === siteId)
  );
};

// Helper function to get asset count for a site
export const getAssetCountForSite = (siteId: string): number => {
  return getAssetsForSite(siteId).length;
};

// Helper function to get preview images for a site (up to 3)
export const getPreviewImagesForSite = (siteId: string): string[] => {
  const siteAssets = getAssetsForSite(siteId);
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