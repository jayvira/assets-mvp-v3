"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/spring-ui/dropdown-menu"
import { Check } from "lucide-react"
import { useMode } from "@/context/ModeContext"
import { useApp, AppSection } from "@/context/AppContext"
import { useMainAppTheme } from "@/context/MainAppThemeContext"
import { useTheme } from "@/context/ThemeContext"
import { 
  OptimizeIcon, 
  LocalizationIcon, 
  DesktopBreakpointIcon, 
  PageDefaultIcon, 
  CommentIcon, 
  ChevronSmallDownIcon, 
  CheckDefaultIcon,
  MenuIcon,
  UndoIcon,
  RedoIcon,
  SettingsIcon,
  DashboardIcon,
  EditIcon,
  CodeIcon,
  HelpCircleIcon,
  HelpShortcutsIcon,
  SearchDefaultIcon,
  CssPreviewIcon,
  BrushIcon,
  CMSDefaultIcon,
  DesignIcon,
  AnalyzeIcon,
  IntersectSquareIcon,
  SunMoonIcon,
  WebflowIcon
} from "@/icons"
import { Button } from "@/components/spring-ui/button"
import { usePages } from "@/context/PagesContext"
import { useLocale } from "@/context/LocaleContext"

// Type for navigation items
interface NavItem {
  value: AppSection;
  label: string;
  icon: React.ReactNode;
}

export function Navbar() {
  const { mode, setMode } = useMode();
  const { currentSection, navigateTo, openStyleGuide } = useApp();
  const { theme } = useTheme();
  const { setMainAppMode } = useMainAppTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const router = useRouter();
  const { currentLocale, locales, setCurrentLocale } = useLocale();

  const toggleTheme = () => {
    const newMode = theme.mode === "light" ? "dark" : "light";
    setMainAppMode(newMode);
  };

  // Define navigation items (without home/design)
  const navItems: NavItem[] = [
    {
      value: 'apps',
      label: 'Apps',
      icon: <IntersectSquareIcon size={16} className="opacity-70" />
    },
    {
      value: 'cms',
      label: 'CMS',
      icon: <CMSDefaultIcon size={16} className="opacity-70" />
    },
    {
      value: 'insights',
      label: 'Insights',
      icon: <AnalyzeIcon size={16} className="opacity-70" />
    }
  ];

  // Handle design button click when not in design section
  const handleDesignButtonClick = () => {
    if (currentSection !== 'home') {
      navigateTo('home');
    }
  };

  return (
    <nav className="flex h-[35px] items-center bg-[var(--bg-primary)] text-[var(--text-primary)] border-b border-[var(--border-default)] body-text pr-2">
      {/* Logo/Home with Menu Dropdown */}
      <div className="flex items-center justify-center w-[35px] h-[35px] border-r border-[var(--border-default)]">
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <div 
              className="flex items-center justify-center w-full h-full hover:bg-[var(--bg-tertiary)] cursor-pointer"
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
            >
              {menuOpen || logoHovered ? (
                <MenuIcon size={20} className="text-[var(--text-primary)]" />
              ) : (
                <WebflowIcon size={20} style={{ color: 'var(--text-secondary)' }} />
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[220px]">
            <DropdownMenuItem onClick={() => {
              setMenuOpen(false);
              router.push('/dashboard');
            }}>
              <DashboardIcon size={16} className="mr-1" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMenuOpen(false)}>
              <SettingsIcon size={16} className="mr-1" />
              Site settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMenuOpen(false)}>
              <EditIcon size={16} className="mr-1" />
              Editor
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setMenuOpen(false)}>
              <SearchDefaultIcon size={16} className="mr-1" />
              Quick find
              <DropdownMenuShortcut className="ml-auto">⌘E/⌘K</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setMenuOpen(false)}>
              <UndoIcon size={16} className="mr-1" />
              Undo
              <DropdownMenuShortcut className="ml-auto">⌘Z</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMenuOpen(false)}>
              <RedoIcon size={16} className="mr-1" />
              Redo
              <DropdownMenuShortcut className="ml-auto">⌘⇧Z</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setMenuOpen(false)}>
              <CodeIcon size={16} className="mr-1" />
              Export code
              <DropdownMenuShortcut className="ml-auto">⇧E</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setMenuOpen(false)}>
              <HelpShortcutsIcon size={16} className="mr-1" />
              Keyboard shortcuts
              <DropdownMenuShortcut className="ml-auto">⇧?</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMenuOpen(false)}>
              <CssPreviewIcon size={16} className="mr-1" />
              CSS preview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMenuOpen(false)}>
              <HelpCircleIcon size={16} className="mr-1" />
              Help & feedback
              <DropdownMenuShortcut className="ml-auto">⌃⇧/</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => {
                setMenuOpen(false);
                router.push('/style-guide');
              }}
            >
              <BrushIcon size={16} className="mr-1" />
              Spring Design System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Left side - Top level navigation */}
      <div className="flex items-center ml-2 space-x-1">
        {/* Design button/dropdown - behaves differently based on current section */}
        {currentSection === 'home' ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center h-6 px-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-raised)] rounded-[4px] body-text focus:outline-none">
              <DesignIcon className="w-[16px] h-[16px] mr-2 opacity-70" />
              <span>{mode}</span>
              <ChevronSmallDownIcon className="opacity-50 ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start"
              className="w-[280px] bg-[var(--bg-primary)] rounded-[4px] border-0 text-[var(--text-primary)] body-text [&>*]:gap-0 px-0"
            >
              <DropdownMenuItem 
                className="flex items-start py-[4px] px-[8px] focus:bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)] focus:text-[var(--text-primary)] cursor-pointer gap-0 rounded-none"
                onClick={() => setMode('Design')}
              >
                <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
                  {mode === 'Design' && <Check className="w-[16px] h-[16px] text-[var(--text-primary)]" strokeWidth={2} />}
                </div>
                <div className="ml-[4px]">
                  <div className="text-[var(--text-primary)]">Design</div>
                  <div className="text-[var(--text-secondary)]">Style elements and build layouts</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-start py-[4px] px-[8px] focus:bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)] focus:text-[var(--text-primary)] cursor-pointer gap-0 rounded-none"
                onClick={() => setMode('Build')}
              >
                <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
                  {mode === 'Build' && <Check className="w-[16px] h-[16px] text-[var(--text-primary)]" strokeWidth={2} />}
                </div>
                <div className="ml-[4px]">
                  <div className="text-[var(--text-primary)]">Build</div>
                  <div className="text-[var(--text-secondary)]">Build pages with components and edit content</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-start py-[4px] px-[8px] focus:bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)] focus:text-[var(--text-primary)] cursor-pointer gap-0 rounded-none"
                onClick={() => setMode('Develop')}
              >
                <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
                  {mode === 'Develop' && <Check className="w-[16px] h-[16px] text-white" strokeWidth={2} />}
                </div>
                <div className="ml-[4px]">
                  <div className="text-[var(--text-primary)]">Develop</div>
                  <div className="text-[var(--text-secondary)]">View and edit custom code on your site</div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            variant="ghost"
            size="comfortable" 
            className="h-6"
            onClick={handleDesignButtonClick}
          >
            <DesignIcon className="w-[16px] h-[16px] mr-1.5"/>
            <span>Design</span>
          </Button>
        )}
        
        {/* Other navigation items */}
        {navItems.map((item) => (
          <Button 
            key={item.value}
            variant={currentSection === item.value ? "default" : "ghost"}
            size="comfortable" 
            className={`h-6 ${currentSection === item.value ? 'bg-[var(--bg-raised)]' : ''}`}
            onClick={() => navigateTo(item.value)}
          >
            {item.icon}
            <span className="ml-1">{item.label}</span>
          </Button>
        ))}
      </div>

      {/* Center - Controls, only shown in home/design section */}
      <div className="flex-1 flex items-center justify-center">
        {currentSection === 'home' && (
          <div className="flex items-center">
            <Button variant="ghost" size="comfortable" className="h-6">
              <OptimizeIcon size={16} className="opacity-70" />
              <span>Optimize</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="comfortable" className="h-6 ml-1">
                  <LocalizationIcon size={16} className="opacity-70" />
                  <span>{currentLocale.displayName}</span>
                  <ChevronSmallDownIcon className="opacity-50 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[200px]">
                {locales.map((locale) => (
                  <DropdownMenuItem
                    key={locale.id}
                    onClick={() => setCurrentLocale(locale)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      {currentLocale.id === locale.id ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <div className="w-4 h-4 mr-2" />
                      )}
                      <span>{locale.displayName}</span>
                    </div>
                    {locale.isPrimary && (
                      <span className="text-xs text-[var(--text-secondary)]">
                        Primary
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="mx-2 h-4 border-r border-[var(--border-default)]"></div>
            
            <PageSelector />
            
            <Button variant="ghost" size="comfortable" className="h-6 ml-1">
              <DesktopBreakpointIcon size={16} className="opacity-70" />
              <span>Desktop</span>
            </Button>
          </div>
        )}
      </div>

      {/* Right side - Theme Switcher, Action buttons */}
      <div className="flex items-center gap-1">
        {/* Theme Switcher Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={toggleTheme}
          title={`Switch to ${theme.mode === "light" ? "dark" : "light"} theme`}
        >
          <SunMoonIcon size={16} />
        </Button>
        
        <Button variant="ghost-success" size="icon" className="h-6 w-6">
          <CheckDefaultIcon size={16} className="text-[var(--text-green)]" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <CommentIcon size={16} className="opacity-70" />
        </Button>
        <Button variant="outline" size="comfortable" className="h-6">
          Share
        </Button>
        <Button variant="default" size="comfortable" className="h-6">
          Publish
        </Button>
      </div>
    </nav>
  )
}

// New component for page selection
function PageSelector() {
  const { selectedPage, setSelectedPage } = usePages();
  
  // Map paths to readable names
  const getPageName = (path: string) => {
    switch(path) {
      case '/': return 'Home';
      case '/contact': return 'Contact Us';
      case '/styles': return '[Draft] Styles';
      case '/class': return 'Class Template';
      case '/testimonials': return 'Testimonials Template';
      case '/password': return 'Password';
      case '/404': return '404';
      default: return 'Select a Page';
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="compact" className="h-6">
          <PageDefaultIcon 
            size={16} 
            className={`opacity-70 ${(selectedPage === '/class' || selectedPage === '/testimonials') ? 'color-purple-text' : ''}`} 
          />
          <span className={(selectedPage === '/class' || selectedPage === '/testimonials') ? 'color-purple-text' : ''}>
            {getPageName(selectedPage)}
          </span>
          <ChevronSmallDownIcon className={`opacity-70 ${(selectedPage === '/class' || selectedPage === '/testimonials') ? 'color-purple-text' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[160px]">
        <DropdownMenuItem onClick={() => setSelectedPage('/')}>
          <PageDefaultIcon size={16} className="mr-[4px]" />
          Home
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSelectedPage('/contact')}>
          <PageDefaultIcon size={16} className="mr-[4px]" />
          Contact Us
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSelectedPage('/styles')}>
          <PageDefaultIcon size={16} className="mr-[4px] text-[var(--text-orange)]" />
          [Draft] Styles
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setSelectedPage('/class')}>
          <PageDefaultIcon size={16} className="mr-[4px] color-purple-text" />
          <span className="color-purple-text">Class Template</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSelectedPage('/testimonials')}>
          <PageDefaultIcon size={16} className="mr-[4px] color-purple-text" />
          <span className="color-purple-text">Testimonials Template</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setSelectedPage('/password')}>
          <PageDefaultIcon size={16} className="mr-[4px]" />
          Password
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSelectedPage('/404')}>
          <PageDefaultIcon size={16} className="mr-[4px]" />
          404
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 