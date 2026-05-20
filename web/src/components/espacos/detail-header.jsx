'use client'

import { Badge } from "#/components/ui/badge"

export function DetailHeader({ space }) {
  if (!space) return null
  return (
    <div className="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            {space.name}
          </h1>
          <Badge variant="outline">{space.city}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {space.city} · {space.postal_code}
        </p>
      </div>
    </div>
  )
}
