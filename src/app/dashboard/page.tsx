"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { SiteGrid } from "@/components/dashboard/site-grid";
import { useState, useRef } from "react";
import AssetCard from "@/components/designer/layout/panels/leftpanel/AssetCard";
import { ImageIcon, VideoIcon, MainDocsIcon } from "@/icons";
import { FaThLarge, FaList } from "react-icons/fa";
import { CloseDefaultIcon } from "@/icons/CloseDefaultIcon";
import { DeleteIcon } from "@/icons/DeleteIcon";
import { DownloadIcon } from "@/icons/DownloadIcon";
import AssetDetailModal from "@/components/designer/layout/panels/leftpanel/AssetDetailModal";
import { Button } from '@/components/spring-ui/button';
import { AddIcon } from '@/icons/AddIcon';
import { SiteIcon } from '@/icons/SiteIcon';
import { TagPill } from '@/components/TagPill';

  // mock assets

  const mockAssets = [
    {
      id: 1,
      type: "JPG",
      icon: "ImageIcon",
      name: "team-collaboration-hero",
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
      dateModified: "2024-06-10T10:00:00Z",
      uploadedDate: "2024-06-10T10:00:00Z",
      fileSize: "2.4 MB",
      uploadedBy: "Sarah Johnson",
      tags: ["team", "collaboration"],
      fileType: "Images",
      status: "Approved",
      altText: "Team collaboration meeting with people working together",
      version: "V1",
      siteUsage: ["1", "24", "7"],
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
      siteUsage: ["2", "5"],
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
      siteUsage: ["3", "6"],
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
      siteUsage: ["4"],
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
      siteUsage: ["6"],
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
      siteUsage: ["1", "24", "7"],
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
      siteUsage: ["8"],
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
      siteUsage: ["2", "5"],
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
      siteUsage: ["7"],
      width: 1280,
      height: 720,
    },
    {
      id: 10,
      type: "PNG",
      icon: "ImageIcon",
      name: "newsletter-signup-banner",
      url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop",
      dateModified: "2024-06-03T23:00:00Z",
      uploadedDate: "2024-06-03T23:00:00Z",
      fileSize: "2.7 MB",
      uploadedBy: "Kevin Martinez",
      tags: ["newsletter", "signup"],
      fileType: "Images",
      status: "No status",
      altText: "Newsletter signup banner with call-to-action design",
      version: "V1",
      siteUsage: ["4", "7"],
      width: 1920,
      height: 600,
    },
    {
      id: 11,
      type: "AVIF",
      icon: "ImageIcon",
      name: "office-conversation",
      url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
      dateModified: "2024-06-02T21:00:00Z",
      uploadedDate: "2024-06-02T21:00:00Z",
      fileSize: "1.6 MB",
      uploadedBy: "Amanda Foster",
      tags: ["office", "conversation"],
      fileType: "Images",
      status: "Approved",
      altText: "Office conversation between colleagues",
      version: "V1",
      siteUsage: ["36", "8"],
      width: 2048,
      height: 1365,
    },
    {
      id: 12,
      type: "JPG",
      icon: "ImageIcon",
      name: "thought-leadership",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
      dateModified: "2024-06-01T19:00:00Z",
      uploadedDate: "2024-06-01T19:00:00Z",
      fileSize: "2.3 MB",
      uploadedBy: "Ryan Cooper",
      tags: ["leadership", "professional"],
      fileType: "Images",
      status: "In Progress",
      altText: "Thought leadership portrait of a business professional",
      version: "V1",
      siteUsage: ["3", "6"],
      width: 1200,
      height: 1800,
    },
    {
      id: 13,
      type: "PNG",
      icon: "ImageIcon",
      name: "testimonial-screenshot-app",
      url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop",
      dateModified: "2024-05-31T17:00:00Z",
      uploadedDate: "2024-05-31T17:00:00Z",
      fileSize: "3.8 MB",
      uploadedBy: "Sophie Turner",
      tags: ["testimonial", "app"],
      fileType: "Images",
      status: "Needs Edit",
      altText: "Screenshot of app with customer testimonial",
      version: "V1",
      siteUsage: ["7"],
      width: 1600,
      height: 900,
    },
    {
      id: 14,
      type: "AVIF",
      icon: "ImageIcon",
      name: "founder-bio",
      url: "https://cdn.prod.website-files.com/68073d50f72fc4822d5b8250/684356ac2a2bced174239e4a_Tab%20Image%201.avif",
      dateModified: "2024-05-30T15:00:00Z",
      uploadedDate: "2024-05-30T15:00:00Z",
      fileSize: "1.4 MB",
      uploadedBy: "Marcus Johnson",
      tags: ["founder", "bio"],
      fileType: "Images",
      status: "Needs Review",
      altText: "Founder bio portrait for company website",
      version: "V1",
      siteUsage: ["6", "8"],
      width: 1200,
      height: 1600,
    },
    {
      id: 15,
      type: "PNG",
      icon: "ImageIcon",
      name: "team-culture",
      url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
      dateModified: "2024-05-29T13:00:00Z",
      uploadedDate: "2024-05-29T13:00:00Z",
      fileSize: "2.9 MB",
      uploadedBy: "Nina Patel",
      tags: ["team", "culture"],
      fileType: "Images",
      status: "No status",
      altText: "Team culture showing diverse group working together",
      version: "V1",
      siteUsage: ["36", "8"],
      width: 2400,
      height: 1600,
    },
    {
      id: 16,
      type: "JPG",
      icon: "ImageIcon",
      name: "remote-team-collaboration",
      url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
      dateModified: "2024-05-28T11:00:00Z",
      uploadedDate: "2024-05-28T11:00:00Z",
      fileSize: "3.5 MB",
      uploadedBy: "Carlos Rodriguez",
      tags: ["remote", "collaboration"],
      fileType: "Images",
      status: "Approved",
      altText: "Remote team collaboration through video conferencing",
      version: "V1",
      siteUsage: ["7", "8"],
      width: 1920,
      height: 1080,
    },
    {
      id: 17,
      type: "AVIF",
      icon: "ImageIcon",
      name: "product-contact",
      url: "https://cdn.prod.website-files.com/68073d50f72fc4822d5b8250/68134251877dc22c4de4c66b_Unique%20Page%2011.avif",
      dateModified: "2024-05-28T11:00:00Z",
      uploadedDate: "2024-05-28T11:00:00Z",
      fileSize: "2.0 MB",
      uploadedBy: "Zoe Anderson",
      tags: ["remote", "collaboration"],
      fileType: "Images",
      status: "Approved",
      altText: "Remote team collaboration through video conferencing",
      version: "V1",
      siteUsage: ["147"],
      width: 1600,
      height: 900,
    },
  ];

// end mock assets

const siteIdToName = {
  "1": "Acme Marketing",
  "2": "Personal Blog",
  "3": "E-Commerce Store",
  "4": "Portfolio",
  "5": "Landing Page",
  "6": "Internal Wiki",
  "7": "Event Site",
  "8": "Product Demo",
  "24": "Design System",
  "36": "HR Portal",
  "147": "Legacy Site",
};
const allSites = Array.from(
  new Set(mockAssets.flatMap(asset => asset.siteUsage))
).map(id => ({ id, name: siteIdToName[String(id) as keyof typeof siteIdToName] || `Site ${id}` }));

const allTags = Array.from(new Set(mockAssets.flatMap(asset => asset.tags)));
const allFileTypes = ["Images", "Videos", "Audio", "Illustrator & Vector Graphics", "PDFs", "Documents", "Rive", "Lottie"];
const allStatuses = ["No status", "Needs Edit", "In Progress", "Needs Review", "Approved"];

export default function Dashboard() {
  const [selectedSection, setSelectedSection] = useState("all-sites");
  const [viewMode, setViewMode] = useState("gallery");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFileType, setSelectedFileType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedAssetIds, setSelectedAssetIds] = useState<number[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [assets, setAssets] = useState([...mockAssets]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState("");
  // Track selected tags per asset by asset id
  const [rowSelectedTags, setRowSelectedTags] = useState<Record<number, string[]>>({});

  const handleSelect = (id: number, checked: boolean) => {
    setSelectedAssetIds(prev =>
      checked ? [...prev, id] : prev.filter(selectedId => selectedId !== id)
    );
  };

  const handleAssetCardClick = (asset: any) => {
    // Ensure the asset has all required metadata fields
    const assetWithMetadata = {
      ...asset,
      fileSize: asset.fileSize || 'Unknown',
      uploadedBy: asset.uploadedBy || 'Unknown',
      uploadedDate: asset.uploadedDate || asset.dateModified || 'Unknown',
      lastModifiedDate: asset.dateModified || 'Unknown',
      title: asset.name || 'Unknown'
    };
    setSelectedAsset(assetWithMetadata);
    setIsModalOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const uploadedDate = new Date().toISOString();
    const newAssets = Array.from(files).map((file, idx) => {
      let type = "documents";
      if (file.type.startsWith("image/")) type = "images";
      else if (file.type.startsWith("video/")) type = "videos";
      const fileSize = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(1)} KB`;

      // Generate up to 3 relevant tags from file name and type
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const nameParts = baseName.split(/[-_\s]+/).filter(Boolean);
      const typeTag = type.slice(0, -1); // e.g., 'image', 'video', 'document'
      // Lowercase and deduplicate
      const tagsSet = new Set([
        ...nameParts.map(part => part.toLowerCase()),
        typeTag
      ]);
      const tags = Array.from(tagsSet).slice(0, 3);

      return {
        id: Date.now() + idx,
        type,
        icon: type === "images" ? "ImageIcon" : type === "videos" ? "VideoIcon" : "MainDocsIcon",
        name: file.name,
        url: URL.createObjectURL(file),
        dateModified: uploadedDate,
        uploadedDate: uploadedDate,
        fileSize: file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(file.size / 1024).toFixed(1)} KB`,
        uploadedBy: "Current User",
        tags,
        fileType: type.charAt(0).toUpperCase() + type.slice(1),
        status: "No status",
        altText: `Uploaded file: ${file.name}`,
        version: "V1",
        siteUsage: [],
        width: 800,
        height: 600,
      };
    });
    setAssets(prev => [...newAssets, ...prev]);
    event.target.value = '';
  };

  // Filter and sort assets
  const filteredAssets = assets
    .filter(asset =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.tags && asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    )
    .filter(asset => selectedTags.length === 0 || selectedTags.every(tag => asset.tags.includes(tag)))
    .filter(asset => !selectedFileType || asset.fileType === selectedFileType)
    .filter(asset => !selectedStatus || asset.status === selectedStatus)
    .filter(asset => !selectedSite || (asset.siteUsage && asset.siteUsage.includes(selectedSite)))
    .sort((a, b) => sortDesc
      ? new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime()
      : new Date(a.dateModified).getTime() - new Date(b.dateModified).getTime()
    );

  const anyFilterActive = selectedTags.length > 0 || selectedFileType || selectedStatus || selectedSite || searchQuery;

  const renderContent = () => {
    switch (selectedSection) {
      case "all-sites":
        return <SiteGrid />;
      case "tutorials":
        return (
          <div className="p-6">
            <h1 className="title-text-bold mb-4 text-[var(--text-primary)]">Tutorials</h1>
            <p className="body-text text-[var(--text-secondary)]">Learn how to build amazing websites with our comprehensive tutorials and guides.</p>
          </div>
        );
      case "assets":
        return (
          <>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="title-text-bold text-[var(--text-primary)]">Assets</h1>
                {/* Hidden file input for uploads */}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  multiple
                  onChange={handleFileChange}
                />
                <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
                  <AddIcon className="mr-2" /> Upload
                </Button>
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search all assets"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4 flex flex-wrap gap-2 items-center max-h-[24px]">
                {/* Site filter - now first */}
                <button className="flex items-center gap-1 px-3 py-1 border rounded text-gray-700 bg-white hover:bg-gray-100">
                  <SiteIcon className="w-4 h-4" />
                  Site
                  <select value={selectedSite} onChange={e => setSelectedSite(e.target.value)} className="ml-2 bg-transparent outline-none">
                    <option value="">All</option>
                    {allSites.map(site => (
                      <option key={site.id} value={site.id}>{site.name}</option>
                    ))}
                  </select>
                </button>
                {/* Tag filter - now after site filter */}
                <div className="relative">
                  <button type="button" className="flex items-center gap-1 px-3 py-1 border rounded text-gray-700 bg-white hover:bg-gray-100" onClick={() => setShowTagDropdown((v: boolean) => !v)}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M3 6a5 5 0 1 1 10 0c0 2.5-2.5 5.5-4.1 7.2a1 1 0 0 1-1.4 0C5.5 11.5 3 8.5 3 6Z" stroke="currentColor" strokeWidth="1.2"/></svg>
                    {selectedTags.length === 0 ? 'Tags' : selectedTags[0]}
                    <svg width="12" height="12" fill="none" viewBox="0 0 12 12"><path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.2"/></svg>
                  </button>
                  {showTagDropdown && (
                    <div className="absolute z-10 mt-1 w-32 bg-white border rounded shadow max-h-[300px] overflow-y-auto">
                      <div className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => { setSelectedTags([]); setShowTagDropdown(false); }}>All</div>
                      {allTags.map(tag => (
                        <div key={tag} className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => { setSelectedTags([tag]); setShowTagDropdown(false); }}>{tag}</div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Type filter */}
                <button className="flex items-center gap-1 px-3 py-1 border rounded text-gray-700 bg-white hover:bg-gray-100">
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="3" y="5" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg>
                  Type
                  <select value={selectedFileType} onChange={e => setSelectedFileType(e.target.value)} className="ml-2 bg-transparent outline-none">
                    <option value="">All</option>
                    {allFileTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </button>
                {/* Status filter */}
                <button className="flex items-center gap-1 px-3 py-1 border rounded text-gray-700 bg-white hover:bg-gray-100">
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" fill="currentColor"/></svg>
                  Status
                  <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="ml-2 bg-transparent outline-none">
                    <option value="">All</option>
                    {allStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                  </select>
                </button>
                <Button
                  variant="ghost"
                  className={`max-h-[24px] ${anyFilterActive ? '' : 'invisible'}`}
                  disabled={!anyFilterActive}
                  onClick={() => {
                    setSelectedTags([]);
                    setSelectedFileType("");
                    setSelectedStatus("");
                    setSelectedSite("");
                    setSearchQuery("");
                  }}
                >
                  Clear
                </Button>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">{filteredAssets.length} assets</span>
                <div className="flex items-center gap-4">
                  <button
                    className="flex items-center gap-1 text-sm text-gray-700 hover:text-black font-medium px-2 py-1 rounded transition-colors"
                    onClick={() => setSortDesc((v) => !v)}
                    aria-label="Sort by date modified"
                  >
                    Date modified
                    <span className="inline-block">
                      {sortDesc ? (
                        <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 11l-4-4h8l-4 4z" fill="currentColor"/></svg>
                      ) : (
                        <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 5l4 4H4l4-4z" fill="currentColor"/></svg>
                      )}
                    </span>
                  </button>
                  <div className="flex gap-2">
                    <button
                      className={`p-2 rounded ${viewMode === 'gallery' ? 'bg-gray-200' : ''}`}
                      onClick={() => setViewMode('gallery')}
                      aria-label="Gallery view"
                    >
                      <FaThLarge />
                    </button>
                    <button
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : ''}`}
                      onClick={() => setViewMode('list')}
                      aria-label="List view"
                    >
                      <FaList />
                    </button>
                  </div>
                </div>
              </div>
              {viewMode === 'gallery' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredAssets.map((asset) => (
                    <AssetCard
                      key={asset.id}
                      id={asset.id}
                      type={asset.type as string}
                      icon={
                        asset.icon === 'ImageIcon' ? ImageIcon :
                        asset.icon === 'VideoIcon' ? VideoIcon :
                        asset.icon === 'MainDocsIcon' ? MainDocsIcon :
                        ImageIcon
                      }
                      name={asset.name}
                      url={asset.url}
                      isSelected={false}
                      className="bg-white"
                      selected={selectedAssetIds.includes(asset.id)}
                      onSelect={checked => handleSelect(asset.id, checked)}
                      onClick={() => handleAssetCardClick(asset)}
                    />
                  ))}
                </div>
              ) : (
                <div className="divide-y rounded-lg bg-white">
                  {filteredAssets.map((asset) => (
                    <div key={asset.id} className="flex items-center gap-4 p-3 px-4 relative">
                      <input
                        type="checkbox"
                        checked={selectedAssetIds.includes(asset.id)}
                        onChange={e => handleSelect(asset.id, e.target.checked)}
                        className="w-4 h-4 accent-blue-600 rounded border-gray-300 shadow absolute left-0 top-1/2 -translate-y-1/2"
                        onClick={e => e.stopPropagation()}
                      />
                      <div
                        className="flex items-center gap-4 cursor-pointer flex-1"
                        onClick={() => handleAssetCardClick(asset)}
                      >
                        <img src={asset.url} alt={asset.name} className="w-16 h-16 object-cover rounded ml-6" />
                        <div>
                          <div className="font-medium text-gray-900">{asset.name}</div>
                          <div className="text-xs text-gray-500">{asset.type}</div>
                        </div>
                      </div>
                        {asset.tags && asset.tags.length > 0 && (
                          <div className="flex items-center gap-3 mt-3 justify-start" style={{ width: '300px' }}>
                            {asset.tags.map((tag) => {
                              const selected = (rowSelectedTags[asset.id] ?? asset.tags).includes(tag);
                              return (
                                <TagPill
                                  key={tag}
                                  tag={tag}
                                  isSelected={selected}
                                  onClick={() => {
                                    setRowSelectedTags(prev => {
                                      const current = prev[asset.id] ?? asset.tags;
                                      return {
                                        ...prev,
                                        [asset.id]: selected
                                          ? current.filter(t => t !== tag)
                                          : [...current, tag],
                                      };
                                    });
                                  }}
                                />
                              );
                            })}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedAssetIds.length > 0 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-4xl rounded-[8px] shadow-2xl bg-[#131313] flex items-center p-4 gap-4 text-white">
                <button
                  className="hover:text-gray-300 focus:outline-none flex items-center"
                  onClick={() => setSelectedAssetIds([])}
                  aria-label="Clear selection"
                >
                  <CloseDefaultIcon size={28} />
                </button>
                <span className="text-sm font-medium">{selectedAssetIds.length} item{selectedAssetIds.length > 1 ? 's' : ''} selected</span>
                <div className="flex-1" />
                <button
                  className="hover:text-white focus:outline-none flex items-center"
                  aria-label="Download selected"
                >
                  <DownloadIcon size={28} />
                </button>
                <button
                  className="hover:text-red-400 focus:outline-none flex items-center"
                  aria-label="Delete selected"
                >
                  <DeleteIcon size={28} />
                </button>
              </div>
            )}
          </>
        );
      case "general":
        return (
          <div className="p-6">
            <h1 className="title-text-bold mb-4 text-[var(--text-primary)]">General Settings</h1>
            <p className="body-text text-[var(--text-secondary)]">Manage your account settings, preferences, and general configuration options.</p>
          </div>
        );
      case "team":
        return (
          <div className="p-6">
            <h1 className="title-text-bold mb-4 text-[var(--text-primary)]">Team Management</h1>
            <p className="body-text text-[var(--text-secondary)]">Invite team members, manage permissions, and collaborate on your projects.</p>
          </div>
        );
      case "plans":
        return (
          <div className="p-6">
            <h1 className="title-text-bold mb-4 text-[var(--text-primary)]">Plans & Billing</h1>
            <p className="body-text text-[var(--text-secondary)]">View your current plan, upgrade options, and manage billing information.</p>
          </div>
        );
      case "billing":
        return (
          <div className="p-6">
            <h1 className="title-text-bold mb-4 text-[var(--text-primary)]">Billing</h1>
            <p className="body-text text-[var(--text-secondary)]">Manage your payment methods, view invoices, and update billing details.</p>
          </div>
        );
      case "apps-integrations":
        return (
          <div className="p-6">
            <h1 className="title-text-bold mb-4 text-[var(--text-primary)]">Apps & Integrations</h1>
            <p className="body-text text-[var(--text-secondary)]">Connect third-party services and manage your app integrations.</p>
          </div>
        );
      case "libraries-templates":
        return (
          <div className="p-6">
            <h1 className="title-text-bold mb-4 text-[var(--text-primary)]">Libraries & Templates</h1>
            <p className="body-text text-[var(--text-secondary)]">Browse and manage your component libraries and website templates.</p>
          </div>
        );
      default:
        return <SiteGrid />;
    }
  };

  return (
    <DashboardLayout selectedSection={selectedSection} onSectionChange={setSelectedSection}>
      {renderContent()}
      {/* Asset Detail Modal at page level */}
      <AssetDetailModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        asset={selectedAsset}
        assets={filteredAssets}
        currentIndex={selectedAsset ? filteredAssets.findIndex(a => a.id === selectedAsset.id) : undefined}
        onAssetChange={newIndex => {
          if (newIndex >= 0 && newIndex < filteredAssets.length) {
            setSelectedAsset(filteredAssets[newIndex]);
          }
        }}
      />
    </DashboardLayout>
  );
} 