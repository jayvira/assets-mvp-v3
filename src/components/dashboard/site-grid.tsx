"use client";

import { SiteCard } from "./site-card";
import { Button } from "@/components/spring-ui/button";
import { IconButton } from "@/components/spring-ui/icon-button";
import { Badge } from "@/components/spring-ui/badge";
import { Input } from "@/components/spring-ui/input";
import { SegmentedControl, SegmentedControlItem } from "@/components/spring-ui/segmented-control";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/spring-ui/dropdown-menu";
import {
  AddIcon,
  UsersIcon,
  FolderAddIcon,
  GridIcon,
  ListIcon,
  DateIcon,
  ChevronSmallDownIcon,
  SearchDefaultIcon,
} from "@/icons";
import { useState } from "react";
import { getImagePath } from "@/lib/utils";
import { SITES } from "@/config/sites";

// Use centralized sites data
const mockSites = SITES.map(site => ({
  ...site,
  thumbnail: site.thumbnail.startsWith('http') ? site.thumbnail : getImagePath(site.thumbnail || "")
}));

export function SiteGrid() {
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("date-created");

  return (
    <div 
      className="w-full mx-auto"
    >
      <div className="space-y-6">
        {/* Header */}
        <div 
          className="flex items-center justify-between h-10 pb-3 border-b border-[var(--border-default)]">
          {/* Left side - Workspace name and badge */}
          <div className="flex items-center space-x-3">
            <h1 className="title-text-bold text-[var(--text-primary)] truncate">My Workspace</h1>
            <Badge 
              variant="blue" 
              styleType="tinted" 
              shape="square" 
              size="compact"
              className="truncate"
            >
              Growth Workspace
            </Badge>
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center space-x-3">
            {/* Search Input */}
            <div className="relative">
              <Input
                placeholder="Search sites..."
                showSearchIcon={true}
                className="max-w-64"
              />
            </div>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="comfortable" className="flex items-center">
                  <DateIcon size={16} />
                  <span>Date created</span>
                  <ChevronSmallDownIcon size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy('date-created')}>
                  Date created
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('name')}>
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('last-modified')}>
                  Last modified
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Segmented Control */}
            <SegmentedControl
              value={viewMode}
              onValueChange={setViewMode}
            >
              <SegmentedControlItem value="grid" isIcon>
                <GridIcon size={16} />
              </SegmentedControlItem>
              <SegmentedControlItem value="list" isIcon>
                <ListIcon size={16} />
              </SegmentedControlItem>
            </SegmentedControl>

            {/* Add Folder Icon Button */}
            <IconButton variant="outline" size="comfortable">
              <FolderAddIcon size={16} />
            </IconButton>

            {/* Invite Button */}
            <Button variant="default" size="comfortable" className="flex items-center">
              <UsersIcon size={16} />
              <span>Invite</span>
            </Button>

            {/* New Site Button */}
            <Button variant="primary" size="comfortable" className="flex items-center">
              <AddIcon size={16} />
              <span>New site</span>
            </Button>
          </div>
        </div>

        {/* Responsive Grid */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          style={{ gap: '16px' }}
        >
          {mockSites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      </div>
    </div>
  );
} 