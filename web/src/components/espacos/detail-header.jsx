'use client'

import { PencilSimple } from "@phosphor-icons/react"
import { Button } from "#/components/ui/button"

export function DetailHeader({ space, onEdit }) {
  if (!space) return null
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            {space.name}
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          {space.parish} · {space.postal_code}
        </p>
      </div>
      {onEdit ? (
        <Button variant="outline" size="sm" className="shrink-0" onClick={onEdit}>
          <PencilSimple />
          Editar espaço
        </Button>
      ) : null}
    </div>
  )
}
