"use client";

import { Button } from "@/components/spring-ui/button";
import { Avatar } from "@/components/spring-ui/avatar";
import { Row } from "@/components/spring-ui/row";
import { 
  SettingsAltIcon, 
  CMSManageIcon,
  ChevronSmallDownIcon,
  FieldImageIcon,
  FieldVideo24Icon,
  FieldImageSetIcon,
  AddIcon,
} from "@/icons";
import { useState } from "react";

const mainNavItems = [
  { name: "Collections", id: "collections", icon: CMSManageIcon },
  { name: "Images", id: "cms-images", icon: FieldImageIcon },
  { name: "Videos", id: "cms-videos", icon: FieldVideo24Icon },
  { name: "Image Sets", id: "image-sets", icon: FieldImageSetIcon },
  { name: "Add Collection", id: "add-collection", icon: AddIcon },
];

const settingsItems = [
  { name: "General", id: "general", icon: SettingsAltIcon },
];

const workspaces = [
  { name: "My Workspace", current: true },
  { name: "Team Alpha", current: false },
  { name: "Client Project", current: false },
  { name: "Personal", current: false },
];

interface CMSSidebarProps {
  selectedSection?: string;
  onSectionChange?: (section: string) => void;
}

export function CMSSidebar({ selectedSection = "collections", onSectionChange }: CMSSidebarProps) {
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const currentWorkspace = workspaces.find(w => w.current) || workspaces[0];

  return (
    <aside 
      className="h-screen overflow-y-auto border-none bg-[var(--bg-secondary)]"
      style={{ width: '240px' }}
    >
      <div className="p-4 space-y-4">
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

        {/* Main Navigation */}
        <div className="mt-10">
          {mainNavItems.map((item) => (
            <Row
              key={item.name}
              label={item.name}
              icon={<item.icon size={16} />}
              selected={selectedSection === item.id}
              size="compact"
              className="cursor-pointer mb-1"
              onClick={() => onSectionChange?.(item.id)}
            />
          ))}
        </div>

        {/* Settings Section */}
        <div className="pt-4 space-y-1">
          <div className="mb-3">
            <h3 className="px-3 body-text-bold text-[var(--text-secondary)]">
              Settings
            </h3>
          </div>
          <div>
            {settingsItems.map((item) => (
              <Row
                key={item.name}
                label={item.name}
                icon={<item.icon size={16} />}
                selected={selectedSection === item.id}
                size="compact"
                className="cursor-pointer mb-1"
                onClick={() => onSectionChange?.(item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
} 