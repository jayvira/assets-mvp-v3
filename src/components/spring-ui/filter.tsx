import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/spring-ui/dropdown-menu"
import { IconButton } from "@/components/spring-ui/icon-button"
import { ChevronSmallDownIcon, CloseDefaultIcon } from "@/icons"

import { cn } from "@/lib/utils"

const filterVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded body-text transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive [.theme-designer_&]:gap-0.5 [.theme-dashboard_&]:gap-2",
  {
    variants: {
      variant: {
        default:
          "border border-[var(--border-default)] bg-white text-[var(--text-primary)] hover:bg-[var(--bg-raised)]",
        outline:
          "border border-[var(--border-default)] bg-white text-[var(--text-primary)] hover:bg-[var(--bg-raised)]",
        ghost:
          "bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-raised)]",
        "blue-subtle":
          "bg-[var(--blue-bg-transparent)] text-[var(--text-blue)] hover:bg-[var(--blue-bg-transparent-hover)]",
        light:
          "border border-[var(--border-default)] bg-white text-[var(--text-primary)] hover:bg-[var(--bg-raised)]",
        dark:
          "border border-[var(--border-default)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-raised)]",
      },
      state: {
        empty: "",
        filled: "",
      },
      size: {
        comfortable: "[.theme-designer_&]:h-6 [.theme-dashboard_&]:h-8 [.theme-designer_&]:px-2 [.theme-dashboard_&]:px-3",
        compact: "[.theme-designer_&]:h-6 [.theme-dashboard_&]:h-8 [.theme-designer_&]:px-1 [.theme-dashboard_&]:px-2",
        icon: "[.theme-designer_&]:h-6 [.theme-designer_&]:w-6 [.theme-dashboard_&]:w-8",
      },
    },
    defaultVariants: {
      variant: "light",
      state: "empty",
      size: "compact",
    },
  }
)

type FilterProps = React.ComponentProps<"button"> &
  VariantProps<typeof filterVariants> & {
    asChild?: boolean
    onClear?: () => void
    dropdownContent?: React.ReactNode
    ariaLabel?: string
  }

function Filter({
  className,
  variant,
  size,
  state,
  asChild = false,
  children,
  onClear,
  dropdownContent,
  ariaLabel,
  ...props
}: FilterProps) {
  const Comp = asChild ? Slot : "button"
  const [isOpen, setIsOpen] = React.useState(false)

  // Apply appropriate variant based on state and theme
  const effectiveVariant = state === "filled" ? "blue-subtle" : "dark"

  return (
    <div className="flex items-center">
      {/* Right button - either dropdown trigger or clear button */}
      {state === "empty" ? (
        dropdownContent ? (
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center w-full">
                <Comp
                  data-slot="filter"
                  className={cn(filterVariants({ variant: effectiveVariant, size, state, className }), "rounded-r-none border-r-0 flex-1")}
                  {...props}
                >
                  {children}
                </Comp>
                
                {/* Divider line */}
                <div className="h-full w-[1px] bg-[var(--border-default)] -mx-px relative z-10"></div>
                
                <IconButton
                  variant="outline"
                  size={size === "icon" ? "comfortable" : size || "comfortable"}
                  aria-label={ariaLabel || "Filter options"}
                  className="rounded-l-none border-l-0 [.theme-designer_&]:h-6 [.theme-dashboard_&]:h-8"
                >
                  <ChevronSmallDownIcon />
                </IconButton>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" onCloseAutoFocus={(e) => e.preventDefault()}>
              {dropdownContent}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null
      ) : (
        <>
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center">
                <Comp
                  data-slot="filter"
                  className={cn(filterVariants({ variant: effectiveVariant, size, state, className }), "rounded-r-none border-r-0")}
                  {...props}
                >
                  {children}
                </Comp>
                
                {/* Divider line */}
                <div className="h-full w-[1px] bg-[var(--border-default)] -mx-px relative z-10"></div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" onCloseAutoFocus={(e) => e.preventDefault()}>
              {dropdownContent}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <IconButton
            variant="ghost"
            size={size === "icon" ? "comfortable" : size || "comfortable"}
            aria-label="Clear filter"
            className="rounded-l-none [.theme-designer_&]:h-6 [.theme-dashboard_&]:h-8 bg-[var(--blue-bg-transparent)] text-[var(--text-blue)] hover:bg-[var(--blue-bg-transparent-hover)]"
            onClick={onClear}
          >
            <CloseDefaultIcon />
          </IconButton>
        </>
      )}
    </div>
  )
}

export { Filter, filterVariants } 