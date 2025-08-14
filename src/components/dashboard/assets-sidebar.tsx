"use client";

import { Button } from "@/components/spring-ui/button";
import { Avatar } from "@/components/spring-ui/avatar";
import { Row } from "@/components/spring-ui/row";
import { 
  AssetManager24Icon,
  ChevronSmallDownIcon,
  HomeIcon,
  ImageIcon,
  PerformanceIcon,
  VariableIcon,
  AISparkleIcon,
  ArrowLeftIcon,
  SettingsAltIcon, 
  UsersIcon, 
  UpgradeIcon, 
  PaymentIcon, 
  AppsIcon, 
  TemplatesIcon,
  ArchiveIcon,
} from "@/icons";
import { useState } from "react";
import { useRouter, usePathname } from 'next/navigation';

const mainNavItems = [
  { name: "Overview", id: "overview", icon: HomeIcon, href: "/dashboard/assets/overview" },
  { name: "All assets", id: "all-assets", icon: AssetManager24Icon, href: "/dashboard/assets/all-assets" },
  { name: "Archived", id: "archived", icon: ArchiveIcon, href: "/dashboard/assets/archived" },
];

const settingsItems = [
  { name: "General", id: "general", icon: SettingsAltIcon },
  { name: "Plans", id: "plans", icon: UpgradeIcon },
  { name: "Billing", id: "billing", icon: PaymentIcon },
  { name: "Apps & integrations", id: "apps-integrations", icon: AppsIcon },
  { name: "Libraries & templates", id: "libraries-templates", icon: TemplatesIcon },
];

const workspaces = [
  { name: "My Workspace", current: true },
  { name: "Team Alpha", current: false },
  { name: "Client Project", current: false },
  { name: "Personal", current: false },
];

interface AssetsSidebarProps {}

export function AssetsSidebar({}: AssetsSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const currentWorkspace = workspaces.find(w => w.current) || workspaces[0];

  const handleDashboardClick = () => {
    router.push('/dashboard');
  };

  return (
    <aside 
      className="h-screen overflow-y-auto border-r border-[var(--border-default)] bg-white flex flex-col pb-10"
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
                size="lg" 
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
                      size="lg" 
                      fallback={workspace.name.substring(0, 2).toUpperCase()}
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

        {/* Dashboard Back Navigation */}
        <div className="mt-4 mb-6">
          <button
            className="w-full flex items-center px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-raised)] rounded transition-colors"
            onClick={handleDashboardClick}
          >
            <ArrowLeftIcon size={16} className="mr-2 text-[var(--text-secondary)]" />
            <span>Dashboard</span>
          </button>
        </div>

        {/* Main Navigation */}
        <div className="mt-6">
          {mainNavItems.map((item) => (
            <Row
              key={item.name}
              label={item.name}
              icon={<item.icon size={16} />}
              selected={pathname === item.href}
              size="compact"
              className="cursor-pointer mb-1"
              onClick={() => {
                if (pathname !== item.href) {
                  router.push(item.href);
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Settings Section - Bottom */}
      <div className="p-4 pb-10 border-t border-[var(--border-default)]">
        <div className="px-3 py-2">
          <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
            Settings
          </span>
        </div>
        {settingsItems.map((item) => (
          <Row
            key={item.name}
            label={item.name}
            icon={<item.icon size={16} />}
            selected={false}
            size="compact"
            className="cursor-pointer mb-1"
            onClick={() => console.log(`${item.name} clicked`)}
          />
        ))}
      </div>
    </aside>
  );
} 