'use client'

import { cn } from "#/lib/utils"

export function Badge({ children, variant = "secondary", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-none px-1.5 py-0.5 text-xs font-medium ring-1",
        variant === "destructive" && "bg-destructive/10 text-destructive ring-destructive/20",
        variant === "warning" && "bg-yellow-50 text-yellow-700 ring-yellow-200",
        variant === "secondary" && "bg-secondary text-secondary-foreground ring-secondary",
        variant === "outline" && "bg-transparent text-foreground ring-border",
        className
      )}
    >
      {children}
    </span>
  )
}