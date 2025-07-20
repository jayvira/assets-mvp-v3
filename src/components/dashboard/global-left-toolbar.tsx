import React from 'react';
import { WebflowIcon } from '@/icons/WebflowIcon';
import { AssetManager24Icon } from '@/icons/AssetManager24Icon';
import { SitesStackIcon } from '@/icons/SitesStackIcon';
import { CMSManageIcon } from '@/icons/CMSManageIcon';
import { SettingsIcon } from '@/icons/SettingsIcon';
import { useRouter, usePathname } from 'next/navigation';

const navItems = [
  { id: 'sites', label: 'Sites', icon: SitesStackIcon, href: '/dashboard' },
  { id: 'assets', label: 'Assets', icon: AssetManager24Icon, href: '/dashboard/assets/overview' },
  { id: 'cms', label: 'CMS', icon: CMSManageIcon, href: '/dashboard/cms', disabled: true },
];

interface GlobalLeftToolbarProps {
  selectedSection?: string;
  onSectionChange?: (section: string) => void;
}

export function GlobalLeftToolbar({ selectedSection, onSectionChange }: GlobalLeftToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Determine active state based on current pathname
  const getActiveFromPathname = (pathname: string) => {
    if (pathname.startsWith('/dashboard/assets')) {
      return 'assets';
    }
    if (pathname.startsWith('/dashboard/cms')) {
      return 'cms';
    }
    return 'sites';
  };

  const active = getActiveFromPathname(pathname);

  const handleNavClick = (itemId: string) => {
    const navItem = navItems.find(item => item.id === itemId);
    if (navItem && !navItem.disabled) {
      router.push(navItem.href);
    }
  };

  return (
    <nav
      className="h-screen w-[84px] bg-[var(--bg-secondary)] border-r border-[var(--border-default)] flex flex-col items-center justify-between py-4 z-40"
      style={{ minWidth: 84 }}
    >
      {/* Top logo */}
      <div className="flex flex-col items-center gap-8">
        <div className="mb-8">
          <div className="flex items-center justify-center text-[var(--text-primary)]" style={{ width: 36, height: 36 }}>
            <WebflowIcon size={24} />
          </div>
        </div>
        {/* Main nav items */}
        <div className="flex flex-col items-center gap-8 -mt-6">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`flex flex-col items-center justify-center w-12 h-14 rounded transition-colors px-4 py-3 ${
                item.disabled 
                  ? 'text-[var(--text-tertiary)] cursor-not-allowed opacity-50' 
                  : active === item.id 
                    ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]' 
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
              }`}
              onClick={() => handleNavClick(item.id)}
              title={item.disabled ? `${item.label} (Coming Soon)` : item.label}
              disabled={item.disabled}
            >
              <item.icon size={24} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Bottom user avatar and settings */}
      <div className="flex flex-col items-center gap-6 mb-2">
        <button className="flex items-center justify-center w-6 h-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" title="Settings">
          <SettingsIcon size={16} />
        </button>
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="User"
          className="w-10 h-10 rounded-full border-2 border-gray-300"
        />
      </div>
    </nav>
  );
} 