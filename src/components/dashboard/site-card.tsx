"use client";

import { Badge } from "@/components/spring-ui/badge";
import { Button } from "@/components/spring-ui/button";
import { IconButton } from "@/components/spring-ui/icon-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/spring-ui/dropdown-menu";
import {
  MoreIcon,
  SettingsIcon,
  EditIcon,
  ShareIcon,
  MoveIcon,
  DuplicateOutlineIcon,
  ArchiveIcon,
  PublishIcon,
  UnpublishIcon,
} from "@/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Site {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  status: "live" | "draft";
  lastModified: string;
  domain: string;
  plan: string;
  isPublished: boolean;
}

interface SiteCardProps {
  site: Site;
}

export function SiteCard({ site }: SiteCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleNavigateToSite = () => {
    router.push('/');
  };

  const handleMenuAction = (action: string) => {
    if (action === 'settings') {
      router.push('/dashboard/site/settings');
    } else {
      console.log(`${action} action for site: ${site.id}`);
    }
  };

  return (
    <div className="overflow-hidden group">
      {/* Site Image with Hover Overlay */}
      <div 
        className="relative overflow-hidden border-b border-[var(--border-default)] border border-gray-200"
        style={{ height: '157px', borderRadius: '4px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Site thumbnail image */}
        <img 
          src={site.thumbnail}
          alt={site.name}
          className="w-full h-full object-cover"
        />
        
        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-[var(--black-a50)] flex items-center justify-center">
            <Button 
              variant="primary"
              size="comfortable"
              onClick={handleNavigateToSite}
            >
              Open in Webflow
            </Button>
            
            {/* Settings Button in Top Right */}
            <div className="absolute top-2 right-2 w-6 h-6 bg-[var(--bg-primary)] rounded-[4px]">
              <IconButton
                variant="default"
                size="compact"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuAction('settings');
                }}
              >
                <SettingsIcon size={16} />
              </IconButton>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        {/* Title, URL and Overflow Menu */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 my-2">
            <h3 className="body-text-bold text-[var(--text-primary)] mb-1 truncate">
              {site.name}
            </h3>
            <p className="body-text text-[var(--text-secondary)] truncate">
              {site.domain}
            </p>
          </div>
          
          {/* Overflow Menu */}
          <div className="flex-shrink-0 ml-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton
                  variant="ghost"
                  size="comfortable"
                >
                  <MoreIcon size={16} />
                </IconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleMenuAction('settings')}>
                  <SettingsIcon size={16} />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuAction('editor')}>
                  <EditIcon size={16} />
                  Editor
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuAction('share')}>
                  <ShareIcon size={16} />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuAction('move')}>
                  <MoveIcon size={16} />
                  Move to folder
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuAction('duplicate')}>
                  <DuplicateOutlineIcon size={16} />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleMenuAction('archive')}>
                  <ArchiveIcon size={16} />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Status and Plan Row */}
        <div className="flex items-center">
          {/* Publish Status */}
          <div className="flex items-center">
            {site.isPublished ? (
              <PublishIcon 
                size={16} 
                style={{ color: 'var(--text-green)' }}
              />
            ) : (
              <UnpublishIcon 
                size={16} 
                style={{ color: 'var(--text-secondary)' }}
              />
            )}

          </div>

          {/* Plan Badge */}
          <Badge variant="default" shape="square" size="compact" styleType="tinted" className="ml-1">
            {site.plan}
          </Badge>
        </div>
      </div>
    </div>
  );
} 