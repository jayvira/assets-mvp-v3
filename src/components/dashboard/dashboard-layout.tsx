"use client";
import { ReactNode } from "react";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { SitesSidebar } from "@/components/dashboard/sites-sidebar";
import { AssetsSidebar } from "@/components/dashboard/assets-sidebar";
import { CMSSidebar } from "@/components/dashboard/cms-sidebar";
import { GlobalLeftToolbar } from '@/components/dashboard/global-left-toolbar';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
  selectedSection?: string;
  onSectionChange?: (section: string) => void;
}

export function DashboardLayout({ children, selectedSection, onSectionChange }: DashboardLayoutProps) {
  const pathname = usePathname();
  
  // Determine which sidebar to render based on the current pathname
  const getSidebarComponent = () => {
    if (pathname.startsWith('/dashboard/cms')) {
      return <CMSSidebar />;
    } else if (pathname.startsWith('/dashboard/assets')) {
      return <AssetsSidebar />;
    } else {
      return <SitesSidebar />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)]">
      
      {/* Fixed Left Toolbar */}
      <div className="fixed left-0 top-0 h-screen z-50">
        <GlobalLeftToolbar />
      </div>
      
      {/* Fixed Sidebar */}
      <div className="fixed left-[84px] top-0 h-screen z-40">
        {getSidebarComponent()}
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 ml-[324px]">
        <div 
          className="bg-[var(--bg-primary)] overflow-auto h-screen"
          style={{ padding: '24px' }}
        >
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 