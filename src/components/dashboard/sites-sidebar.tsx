"use client";

import { Button } from "@/components/spring-ui/button";
import { Avatar } from "@/components/spring-ui/avatar";
import { Row } from "@/components/spring-ui/row";
import { 
  SettingsAltIcon, 
  UsersIcon, 
  UpgradeIcon, 
  PaymentIcon, 
  AppsIcon, 
  TemplatesIcon,
  ChevronSmallDownIcon,
  SitesStackIcon,
  VideoTutorialsIcon,
  AssetManagerIcon,
  ChevronSmallRightIcon,
  SettingsIcon,
  StyleManager24Icon,
} from "@/icons";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation';
import { getAssetById } from "@/lib/supabase";

const mainNavItems = [
  { name: "All sites", id: "all-sites", icon: SitesStackIcon, href: "/dashboard" },
  { name: "Assets", id: "assets", icon: AssetManagerIcon, href: "/dashboard/assets/overview",
    subItems: [
      { name: "All assets", id: "assets-all", href: "/dashboard/assets/all-assets" },
      { name: "Collections", id: "assets-collections", href: "/dashboard/assets/collections" },
      { name: "Archived", id: "assets-archived", href: "/dashboard/assets/archived" },
      { name: "Brand Assistant", id: "assets-brand-assistant", href: "/dashboard/assets/brand-assistant" },
    ]
  },
  { name: "Brand Guidelines", id: "brand-guidelines", icon: StyleManager24Icon, href: "/dashboard/assets/guidelines" },
  { name: "Apps & integrations", id: "apps-integrations", icon: AppsIcon, href: "/dashboard/apps" },
  { name: "Libraries & templates", id: "libraries-templates", icon: TemplatesIcon, href: "/dashboard/libraries" },
  { name: "Settings", id: "settings", icon: SettingsIcon, href: "/dashboard/settings",
    subItems: [
      { name: "Members", id: "settings-members", href: "/dashboard/settings/members" },
      { name: "Roles", id: "settings-roles", href: "/dashboard/settings/roles" },
      { name: "Plans", id: "settings-plans", href: "/dashboard/settings/plans" },
      { name: "Billing", id: "settings-billing", href: "/dashboard/settings/billing" },
    ]
  },
];

const settingsItems = [
  { name: "General", id: "general", icon: SettingsAltIcon },
  { name: "Plans", id: "plans", icon: UpgradeIcon },
  { name: "Billing", id: "billing", icon: PaymentIcon },
  { name: "Apps & integrations", id: "apps-integrations", icon: AppsIcon },
  { name: "Libraries & templates", id: "libraries-templates", icon: TemplatesIcon },
];

const workspaces = [
  { name: "Forme", current: true },
  { name: "Team Alpha", current: false },
  { name: "Client Project", current: false },
  { name: "Personal", current: false },
];

interface SitesSidebarProps {
  selectedSection?: string;
  onSectionChange?: (section: string) => void;
}

export function SitesSidebar({ selectedSection = "all-sites", onSectionChange }: SitesSidebarProps) {
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [formeAvatarUrl, setFormeAvatarUrl] = useState<string | null>(null);
  const currentWorkspace = workspaces.find(w => w.current) || workspaces[0];
  const router = useRouter();
  const pathname = usePathname();

  // Fetch asset 71 for Forme workspace avatar
  useEffect(() => {
    const fetchFormeAvatar = async () => {
      try {
        const asset = await getAssetById(71);
        if (asset && asset.url) {
          setFormeAvatarUrl(asset.url);
        }
      } catch (error) {
        console.error('Error fetching Forme avatar:', error);
      }
    };
    
    fetchFormeAvatar();
  }, []);

  // Define hardcoded line heights for each sub-item
  const SUB_ITEM_HEIGHTS = {
    assets: {
      'assets-all': 18,        // All assets
      'assets-collections': 57, // Collections  
      'assets-archived': 92,   // Archived
      'assets-brand-assistant': 127, // Brand Assistant
    },
    settings: {
      'settings-members': 18,  // Members
      'settings-roles': 57,    // Roles
      'settings-plans': 92,    // Plans
      'settings-billing': 126, // Billing
    }
  };

  // Helper function to get line height for a section
  const getLineHeight = (sectionId: string) => {
    const activeSubItem = mainNavItems
      .find(item => item.id === sectionId)
      ?.subItems?.find(subItem => isSubItemActive(subItem.href));
    
    if (activeSubItem && sectionId in SUB_ITEM_HEIGHTS) {
      const sectionHeights = SUB_ITEM_HEIGHTS[sectionId as keyof typeof SUB_ITEM_HEIGHTS];
      return sectionHeights[activeSubItem.id as keyof typeof sectionHeights] || 0;
    }
    return 0;
  };

  // Determine active state based on current pathname
  const getActiveFromPathname = (pathname: string) => {
    if (pathname === '/dashboard/assets/guidelines') {
      return 'brand-guidelines';
    }
    if (pathname.startsWith('/dashboard/assets')) {
      return 'assets';
    }
    if (pathname.startsWith('/dashboard/settings')) {
      return 'settings';
    }
    return 'all-sites';
  };

  const activeSection = getActiveFromPathname(pathname);

  // Assets and Settings sections are expanded when on their respective pages
  const isAssetsExpanded = activeSection === 'assets';
  const isSettingsExpanded = activeSection === 'settings';

  const handleNavClick = (itemId: string) => {
    const navItem = mainNavItems.find(item => item.id === itemId);
    if (navItem && navItem.href) {
      router.push(navItem.href);
    }
  };

  const handleSubItemClick = (href: string) => {
    router.push(href);
  };

  const isSubItemActive = (href: string) => {
    return pathname === href;
  };

  return (
    <aside 
      className="h-screen overflow-y-auto border-r border-[var(--border-default)] flex flex-col pb-10"
      style={{ width: '240px' }}
    >
      <div className="p-4 space-y-4 flex-1">
        {/* Workspace Selector */}
        <div className="relative">
          <Button
            variant="ghost"
            className="w-full justify-between p-3 h-auto"
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
          >
            <div className="flex items-center space-x-3">
              <Avatar 
                size="md" 
                src={formeAvatarUrl || undefined}
                fallback={currentWorkspace.name.substring(0, 2).toUpperCase()}
              />
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {currentWorkspace.name}
              </span>
            </div>
            <ChevronSmallDownIcon size={12} />
          </Button>
          
          {/* Workspace Dropdown Menu */}
          {showWorkspaceMenu && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-md shadow-lg">
              <div className="py-1">
                {workspaces.map((workspace) => (
                  <button
                    key={workspace.name}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-[var(--bg-raised)] text-left"
                  >
                    <Avatar 
                      size="md" 
                      src={workspace.name === "Forme" ? formeAvatarUrl || undefined : undefined}
                      fallback={workspace.name.substring(0, 2).toUpperCase()}
                      className="text-sm"
                    />
                    <span className="text-[var(--text-primary)]">
                      {workspace.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <div className="mt-6">
          {mainNavItems.map((item) => (
            <div key={item.name}>
              <Row
                label={item.name}
                icon={<item.icon size={16} />}
                selected={activeSection === item.id && pathname === item.href}
                size="compact"
                className="cursor-pointer mb-1 hover:bg-[var(--bg-raised)]/50 rounded transition-colors"
                onClick={() => {
                  if (item.subItems) {
                    // For Assets and Settings, navigate to their respective overview pages
                    router.push(item.href);
                  } else {
                    handleNavClick(item.id);
                  }
                }}
              />
              
              {/* Sub-items for Assets */}
              {item.subItems && item.id === 'assets' && isAssetsExpanded && (
                <div className="space-y-1 relative">
                  {/* Vertical connecting line when a sub-item is active */}
                  {item.subItems.some(subItem => isSubItemActive(subItem.href)) && (
                    <div 
                      className="absolute w-px"
                      style={{ 
                        left: '17.5px', // Align with the arrow icon, moved 0.5px right
                        top: '-4px', // Start from above the first sub-item, lowered by 4px
                        height: `${getLineHeight('assets')}px`, // Use hardcoded height
                        backgroundColor: '#B8B8B8'
                      }}
                    />
                  )}
                  {item.subItems.map((subItem) => (
                    <Row
                      key={subItem.id}
                      label={subItem.name}
                      icon={
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ opacity: isSubItemActive(subItem.href) ? 1 : 0 }}
                          className="transition-opacity duration-200"
                        >
                          {/* Vertical line */}
                          <path
                            d="M4 3V11"
                            stroke="#B8B8B8"
                            strokeWidth="1"
                            strokeLinecap="round"
                          />
                          {/* Curved corner */}
                          <path
                            d="M4 11C4 11 4 11 4.5 11C5 11 5.5 11 6 11"
                            stroke="#B8B8B8"
                            strokeWidth="1"
                            strokeLinecap="round"
                          />
                          {/* Horizontal line */}
                          <path
                            d="M6 11L12 11"
                            stroke="#B8B8B8"
                            strokeWidth="1"
                            strokeLinecap="round"
                          />
                          {/* Arrowhead */}
                          <path
                            d="M10 8L12 11L10 14"
                            stroke="#B8B8B8"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      }
                      selected={isSubItemActive(subItem.href)}
                      size="compact"
                      className="cursor-pointer text-sm hover:bg-[var(--bg-raised)]/50 rounded transition-colors group"
                      style={{ paddingLeft: '14px' }}
                      onClick={() => handleSubItemClick(subItem.href)}
                      onMouseEnter={(e) => {
                        const svg = e.currentTarget.querySelector('svg');
                        if (svg && !isSubItemActive(subItem.href)) {
                          svg.style.opacity = '0.5';
                        }
                      }}
                      onMouseLeave={(e) => {
                        const svg = e.currentTarget.querySelector('svg');
                        if (svg && !isSubItemActive(subItem.href)) {
                          svg.style.opacity = '0';
                        }
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Sub-items for Settings */}
              {item.subItems && item.id === 'settings' && isSettingsExpanded && (
                <div className="space-y-1 relative">
                  {/* Vertical connecting line when a sub-item is active */}
                  {item.subItems.some(subItem => isSubItemActive(subItem.href)) && (
                    <div 
                      className="absolute w-px"
                      style={{ 
                        left: '17.5px', // Align with the arrow icon, moved 0.5px right
                        top: '-4px', // Start from above the first sub-item, lowered by 4px
                        height: `${getLineHeight('settings')}px`, // Use hardcoded height
                        backgroundColor: '#B8B8B8'
                      }}
                    />
                  )}
                  {item.subItems.map((subItem) => (
                    <Row
                      key={subItem.id}
                      label={subItem.name}
                      icon={
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ opacity: isSubItemActive(subItem.href) ? 1 : 0 }}
                          className="transition-opacity duration-200"
                        >
                          {/* Vertical line */}
                          <path
                            d="M4 3V11"
                            stroke="#B8B8B8"
                            strokeWidth="1"
                            strokeLinecap="round"
                          />
                          {/* Curved corner */}
                          <path
                            d="M4 11C4 11 4 11 4.5 11C5 11 5.5 11 6 11"
                            stroke="#B8B8B8"
                            strokeWidth="1"
                            strokeLinecap="round"
                          />
                          {/* Horizontal line */}
                          <path
                            d="M6 11L12 11"
                            stroke="#B8B8B8"
                            strokeWidth="1"
                            strokeLinecap="round"
                          />
                          {/* Arrowhead */}
                          <path
                            d="M10 8L12 11L10 14"
                            stroke="#B8B8B8"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      }
                      selected={isSubItemActive(subItem.href)}
                      size="compact"
                      className="cursor-pointer text-sm hover:bg-[var(--bg-raised)]/50 rounded transition-colors group"
                      style={{ paddingLeft: '14px' }}
                      onClick={() => handleSubItemClick(subItem.href)}
                      onMouseEnter={(e) => {
                        const svg = e.currentTarget.querySelector('svg');
                        if (svg && !isSubItemActive(subItem.href)) {
                          svg.style.opacity = '0.5';
                        }
                      }}
                      onMouseLeave={(e) => {
                        const svg = e.currentTarget.querySelector('svg');
                        if (svg && !isSubItemActive(subItem.href)) {
                          svg.style.opacity = '0';
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
} 