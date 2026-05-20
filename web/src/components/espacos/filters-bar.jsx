'use client'

import { MagnifyingGlass } from "@phosphor-icons/react"
import { Input } from "#/components/ui/input"

export function FiltersBar({ query, onQueryChange }) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative max-w-md flex-1">
        <MagnifyingGlass className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          aria-label="Pesquisar espaços"
          placeholder="Pesquisar por nome, cidade ou código postal..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>
    </div>
  )
}
