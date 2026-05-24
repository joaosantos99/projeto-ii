'use client'

import { cn } from "#/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"

export function Widget({
  title,
  description,
  action,
  children,
  className,
  headerClassName,
  contentClassName,
}) {
  const hasAction = Boolean(action)
  return (
    <Card className={className}>
      <CardHeader
        className={cn(
          hasAction && "flex flex-row items-center justify-between gap-3",
          headerClassName
        )}
      >
        {hasAction ? (
          <div className="flex flex-col gap-1">
            <CardTitle>{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
        ) : (
          <>
            <CardTitle>{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </>
        )}
        {action}
      </CardHeader>
      <CardContent className={cn("flex flex-col gap-3", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  )
}

export function WidgetTile({ children, className }) {
  return (
    <div className={cn("rounded-none border border-border p-2", className)}>
      {children}
    </div>
  )
}
