"use client";

import { Avatar } from "@/components/spring-ui/avatar";
import { Button } from "@/components/spring-ui/button";
import { NotificationsIcon, ChevronSmallDownIcon, SunMoonIcon } from "@/icons";
import { useState } from "react";
import { useDashboardTheme } from "@/context/DashboardThemeContext";
import { useTheme } from "@/context/ThemeContext";

const navTabs = [
  { id: "dashboard", label: "Dashboard", hasChevron: false },
  { id: "marketplace", label: "Marketplace", hasChevron: true },
  { id: "learn", label: "Learn", hasChevron: false },
  { id: "resources", label: "Resources", hasChevron: true },
];

// Custom 32px Webflow Icon
const WebflowIcon32 = () => (
  <div 
    className="flex items-center justify-center text-[var(--text-primary)]"
    style={{ width: '32px', height: '32px' }}
  >
    <svg
      width="32"
      height="32"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.3333 4L11.2915 12H7.49516L9.18663 8.68446H9.11074C7.71528 10.5186 5.63323 11.726 2.66663 12V8.73034C2.66663 8.73034 4.56444 8.61685 5.6801 7.42922H2.66663V4.00006H6.05345V6.8205L6.12947 6.82018L7.51344 4.00006H10.0748V6.80261L10.1508 6.80249L11.5867 4H15.3333Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

export function DashboardNav() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { theme } = useTheme();
  const { setDashboardMode } = useDashboardTheme();

  const toggleTheme = () => {
    const newMode = theme.mode === "light" ? "dark" : "light";
    setDashboardMode(newMode);
  };

  return (
    <nav 
      className="bg-[var(--bg-primary)] border-b border-[var(--border-default)] w-full"
      style={{ height: '58px' }}
    >
      <div 
        className="flex items-center justify-between h-full px-6"
      >
        {/* Left side - Logo and Tabs */}
        <div className="flex items-center space-x-6">
          {/* Webflow Logo */}
          <WebflowIcon32 />
          
          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center px-3 py-2 transition-colors
                  ${activeTab === tab.id 
                    ? 'text-[var(--text-primary)] body-text-bold border-b-2 border-[var(--text-primary)]' 
                    : 'text-[var(--text-secondary)] body-text border-b-2 border-transparent hover:text-[var(--text-primary)]'
                  }
                `}
                style={{ height: '58px' }}
              >
                {tab.label}
                {tab.hasChevron && <ChevronSmallDownIcon size={12} />}
              </button>
            ))}
          </div>
        </div>

        {/* Right side - Theme Switcher, Notifications, Avatar */}
        <div className="flex items-center space-x-3">
          {/* Theme Switcher Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8"
            onClick={toggleTheme}
            title={`Switch to ${theme.mode === "light" ? "dark" : "light"} theme`}
          >
            <SunMoonIcon size={16} />
          </Button>
          
          {/* Notification Button */}
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <NotificationsIcon size={16} />
          </Button>
          
          {/* Web Designer Avatar */}
          <Avatar 
            size="md" 
            src="https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?q=80&w=2641&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            fallback="WD"
            className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold"
          />
        </div>
      </div>
    </nav>
  );
} 