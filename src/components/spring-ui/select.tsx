import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { ChevronSmallDownIcon, CheckboxIcon } from "@/icons"

const selectTriggerVariants = cva(
  "flex w-full items-center justify-between rounded-[4px] border border-solid py-0 body-text focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed data-[placeholder]:text-[var(--input-placeholder)] [.theme-designer_&]:h-6 [.theme-dashboard_&]:h-8 [.theme-designer_&]:px-1 [.theme-dashboard_&]:px-2 [.theme-designer_&]:gap-0.5 [.theme-dashboard_&]:gap-2",
  {
    variants: {
      variant: {
        default: "bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)] focus:border-[var(--input-border-focus)] hover:border-[var(--input-border-hover)] disabled:bg-[var(--input-disabled-bg)]",
        button: "bg-gradient-to-b from-white/13 to-white/11 text-[var(--text-primary)] shadow-[var(--shadow-button-default)] hover:bg-[var(--bg-raised)] border-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> &
    VariantProps<typeof selectTriggerVariants>
>(({ className, variant, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerVariants({ variant, className }))}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronSmallDownIcon className="h-4 w-4 text-[var(--text-secondary)]" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-hidden rounded-[4px] border-0 bg-[var(--bg-tertiary)] text-[var(--text-primary)] shadow-[var(--shadow-menu-elevated)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "py-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("body-semibold text-[var(--text-secondary)] [.theme-designer_&]:py-0.5 [.theme-dashboard_&]:py-1 [.theme-designer_&]:px-1 [.theme-dashboard_&]:px-2", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center outline-hidden focus:bg-[var(--bg-raised)] hover:bg-[var(--bg-raised)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 body-text [.theme-designer_&]:py-0.5 [.theme-dashboard_&]:py-1 [.theme-designer_&]:pl-1 [.theme-dashboard_&]:pl-2 pr-0",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText className="flex items-center">{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("bg-[var(--border-default)] h-[1px] my-1", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} 