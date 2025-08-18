"use client";

import React from 'react';
import { Button, buttonVariants } from "@/components/spring-ui/button";
import { IconButton } from "@/components/spring-ui/icon-button";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent
} from "@/components/spring-ui/dropdown-menu";
import { ChevronSmallDownIcon } from "@/icons/ChevronSmallDownIcon";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";

// We need to exclude 'link' variant for the split button
type SplitButtonVariants = Exclude<
  NonNullable<VariantProps<typeof buttonVariants>["variant"]>, 
  "link"
>;

interface SplitButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "variant"> {
  children: React.ReactNode;
  menuContent?: React.ReactNode;
  onButtonClick?: () => void;
  onTriggerClick?: () => void;
  className?: string;
  menuClassName?: string;
  variant?: SplitButtonVariants;
  size?: VariantProps<typeof buttonVariants>["size"];
  triggerIcon?: React.ReactNode;
}

export function SplitButton({
  children,
  menuContent,
  variant = "default",
  size = "comfortable",
  onButtonClick,
  onTriggerClick,
  className,
  menuClassName,
  triggerIcon,
  ...props
}: SplitButtonProps) {
  return (
    <div className="flex items-center">
      {/* Main button */}
      <Button
        variant={variant}
        size={size}
        onClick={onButtonClick}
        className={cn(
          "rounded-r-none border-r-0", 
          className
        )}
        {...props}
      >
        {children}
      </Button>
      
      {/* Divider line - visible only for outline variants */}
      {variant.toString().startsWith('outline') && (
        <div className="h-full w-[1px] bg-[var(--border-default)] -mx-px relative z-10"></div>
      )}
      
      {/* Right side button or dropdown */}
      {menuContent ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              variant={variant}
              size={
                size === "comfortable" ? "comfortable" : 
                size === "compact" ? "compact" : 
                size === "icon" ? "comfortable" : "comfortable"
              }
              aria-label="More options"
              className={cn(
                "rounded-l-none [.theme-designer_&]:h-6 [.theme-dashboard_&]:h-8"
              )}
            >
              {triggerIcon || <ChevronSmallDownIcon />}
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={menuClassName}>
            {menuContent}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <IconButton
          variant={variant}
          size={
            size === "comfortable" ? "comfortable" : 
            size === "compact" ? "compact" : 
            size === "icon" ? "comfortable" : "comfortable"
          }
          aria-label="More options"
          className={cn(
            "rounded-l-none [.theme-designer_&]:h-6 [.theme-dashboard_&]:h-8"
          )}
          onClick={onTriggerClick}
        >
          {triggerIcon || <ChevronSmallDownIcon />}
        </IconButton>
      )}
    </div>
  );
}

export default SplitButton; 