"use client";
import { ReactNode } from "react";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { SitesSidebar } from "@/components/dashboard/sites-sidebar";
import { AssetsSidebar } from "@/components/dashboard/assets-sidebar";
import { CMSSidebar } from "@/components/dashboard/cms-sidebar";
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
    } else {
      return <SitesSidebar />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <DashboardNav />
      </div>
      
      {/* Main Content Area with Top Offset */}
      <div className="flex flex-1 pt-[58px]">
        {/* Fixed Sidebar */}
        <div className="fixed left-0 top-[58px] h-[calc(100vh-58px)] z-30">
          {getSidebarComponent()}
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 ml-[240px]">
          <div 
            className="bg-[var(--bg-primary)] overflow-auto h-[calc(100vh-58px)]"
            style={{ padding: '24px' }}
          >
            <main>
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
} 