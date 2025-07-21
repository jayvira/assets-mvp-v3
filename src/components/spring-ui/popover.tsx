"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { CloseDefaultIcon } from "@/icons"
import { Button } from "@/components/spring-ui/button"
import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

interface PopoverContentProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  title?: string;
  hideClose?: boolean;
  headerIcons?: React.ReactNode[];
  primaryAction?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "primary" | "destructive" | "outline" | "subtle" | "ghost";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  leftAction?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "primary" | "destructive" | "outline" | "subtle" | "ghost";
  };
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(({ 
  className, 
  title,
  hideClose = false,
  headerIcons = [],
  primaryAction,
  secondaryAction,
  leftAction,
  children, 
  ...props 
}, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 w-[240px] rounded-[4px] bg-[var(--bg-primary)] p-0 shadow-[var(--shadow-menu-elevated)] outline-none animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    >
      {/* Popover Header (Optional) */}
      {title && (
        <div className="flex items-center justify-between [.theme-designer_&]:px-2 [.theme-dashboard_&]:px-3 [.theme-designer_&]:py-1 [.theme-dashboard_&]:py-2">
          <h5 className="title-text-bold text-[var(--text-primary)]">{title}</h5>
          <div className="flex items-center [.theme-designer_&]:gap-0.5 [.theme-dashboard_&]:gap-1">
            {headerIcons && headerIcons.length > 0 && headerIcons.map((icon, index) => (
              <div key={index} className="flex items-center justify-center rounded hover:bg-[var(--bg-raised)] text-[var(--text-secondary)] transition-colors [.theme-designer_&]:h-6 [.theme-dashboard_&]:h-8 [.theme-designer_&]:w-6 [.theme-dashboard_&]:w-8">
                {icon}
              </div>
            ))}
            {!hideClose && (
              <PopoverPrimitive.Close className="flex items-center justify-center rounded hover:bg-[var(--bg-raised)] text-[var(--text-secondary)] transition-colors [.theme-designer_&]:h-6 [.theme-dashboard_&]:h-8 [.theme-designer_&]:w-6 [.theme-dashboard_&]:w-8">
                <CloseDefaultIcon size={16} />
                <span className="sr-only">Close</span>
              </PopoverPrimitive.Close>
            )}
          </div>
        </div>
      )}

      {/* Popover Body */}
      <div className="body-text text-[var(--text-primary)] [.theme-designer_&]:p-1 [.theme-dashboard_&]:p-2">
        {children}
      </div>

      {/* Popover Footer (Optional) */}
      {(primaryAction || secondaryAction || leftAction) && (
        <div className="flex items-center justify-between border-t border-[var(--border-default)] [.theme-designer_&]:px-1 [.theme-dashboard_&]:px-2 [.theme-designer_&]:py-1 [.theme-dashboard_&]:py-2 [.theme-designer_&]:gap-1 [.theme-dashboard_&]:gap-2">
          <div>
            {leftAction && (
              <Button 
                size="compact" 
                variant={leftAction.variant || "subtle"} 
                onClick={leftAction.onClick}
              >
                {leftAction.label}
              </Button>
            )}
          </div>
          <div className="flex items-center [.theme-designer_&]:gap-1 [.theme-dashboard_&]:gap-2">
            {secondaryAction && (
              <Button 
                size="compact" 
                variant="outline" 
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button 
                size="compact" 
                variant={primaryAction.variant || "primary"} 
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </Button>
            )}
          </div>
        </div>
      )}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent } 