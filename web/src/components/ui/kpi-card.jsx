'use client'

import { cn } from "#/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"

export function KpiCard({ label, value, icon, hint, valueClassName, className }) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className={cn("text-2xl font-semibold tabular-nums", valueClassName)}>{value}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  )
}

export function KpiCardGrid({ children, className }) {
  return (
    <section className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {children}
    </section>
  )
}
