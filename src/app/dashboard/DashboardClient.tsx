"use client";
import { useState } from "react";
import AssetCard from "@/components/designer/layout/panels/leftpanel/AssetCard";
import { SiteGrid } from "@/components/dashboard/site-grid";
import { FaThLarge, FaList } from "react-icons/fa";
import { CloseDefaultIcon } from "@/icons/CloseDefaultIcon";
import { DeleteIcon } from "@/icons/DeleteIcon";
import { DownloadIcon } from "@/icons/DownloadIcon";

export default function DashboardClient({ assets }) {
  const allTags = Array.from(new Set(assets.flatMap(asset => Array.isArray(asset.tags) ? asset.tags : [])));
  const allFileTypes = ["Images", "Videos", "Audio", "Illustrator & Vector Graphics", "PDFs", "Documents", "Rive", "Lottie"];
  const allStatuses = ["No status", "Needs Edit", "In Progress", "Needs Review", "Approved"];

  const [selectedSection, setSelectedSection] = useState("all-sites");
  const [viewMode, setViewMode] = useState("gallery");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFileType, setSelectedFileType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedAssetIds(prev =>
      checked ? [...prev, id] : prev.filter(selectedId => selectedId !== id)
    );
  };

  // Filter and sort assets
  const filteredAssets = assets
    .filter(asset => asset.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(asset => selectedTags.length === 0 || selectedTags.every(tag => Array.isArray(asset.tags) && asset.tags.includes(tag)))
    .filter(asset => !selectedFileType || asset.fileType === selectedFileType)
    .filter(asset => !selectedStatus || asset.status === selectedStatus)
    .sort((a, b) => sortDesc
      ? new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime()
      : new Date(a.dateModified).getTime() - new Date(b.dateModified).getTime()
    );

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
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium">+ Upload</button>
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
              <div className="mb-4 flex flex-wrap gap-2 items-center">
                <div className="relative">
                  <button type="button" className="flex items-center gap-1 px-3 py-1 border rounded text-gray-700 bg-white hover:bg-gray-100" onClick={() => setShowTagDropdown((v) => !v)}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M3 6a5 5 0 1 1 10 0c0 2.5-2.5 5.5-4.1 7.2a1 1 0 0 1-1.4 0C5.5 11.5 3 8.5 3 6Z" stroke="currentColor" strokeWidth="1.2"/></svg>
                    {selectedTags.length === 0 ? 'Tags' : selectedTags[0]}
                    <svg width="12" height="12" fill="none" viewBox="0 0 12 12"><path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.2"/></svg>
                  </button>
                  {showTagDropdown && (
                    <div className="absolute z-10 mt-1 w-32 bg-white border rounded shadow">
                      <div className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => { setSelectedTags([]); setShowTagDropdown(false); }}>All</div>
                      {allTags.map(tag => (
                        <div key={tag} className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => { setSelectedTags([tag]); setShowTagDropdown(false); }}>{tag}</div>
                      ))}
                    </div>
                  )}
                </div>
                <button className="flex items-center gap-1 px-3 py-1 border rounded text-gray-700 bg-white hover:bg-gray-100">
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="3" y="5" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg>
                  Type
                  <select value={selectedFileType} onChange={e => setSelectedFileType(e.target.value)} className="ml-2 bg-transparent outline-none">
                    <option value="">All</option>
                    {allFileTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </button>
                <button className="flex items-center gap-1 px-3 py-1 border rounded text-gray-700 bg-white hover:bg-gray-100">
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" fill="currentColor"/></svg>
                  Status
                  <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="ml-2 bg-transparent outline-none">
                    <option value="">All</option>
                    {allStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                  </select>
                </button>
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
                      type={asset.fileType}
                      name={asset.name}
                      url={asset.url}
                      isSelected={false}
                      className="bg-white"
                      selected={selectedAssetIds.includes(asset.id)}
                      onSelect={checked => handleSelect(asset.id, checked)}
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
                      <img src={asset.url} alt={asset.name} className="w-16 h-16 object-cover rounded ml-6" />
                      <div>
                        <div className="font-medium text-gray-900">{asset.name}</div>
                        <div className="text-xs text-gray-500">{asset.fileType}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedAssetIds.length > 0 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-4xl rounded-lg shadow-2xl bg-[#131313] flex items-center px-8 py-6 gap-6 text-white">
                <button
                  className="mr-4 hover:text-gray-300 focus:outline-none flex items-center"
                  onClick={() => setSelectedAssetIds([])}
                  aria-label="Clear selection"
                >
                  <CloseDefaultIcon size={28} />
                </button>
                <span className="text-lg font-medium">{selectedAssetIds.length} item{selectedAssetIds.length > 1 ? 's' : ''} selected</span>
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
    <div>
      {/* You may want to keep DashboardLayout here if you want sidebar navigation to persist */}
      {renderContent()}
    </div>
  );
} 