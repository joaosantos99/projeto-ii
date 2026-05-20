'use client'

import { MagnifyingGlass } from "@phosphor-icons/react"
import { Input } from "#/components/ui/input"
import { selectClass, priorityOptions } from "#/data/manutencao"

export function FiltersBar({
  query,
  onQueryChange,
  zoneFilter,
  onZoneFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  zones,
}) {
  return (
    <div className="grid gap-3 lg:grid-cols-4">
      <div className="relative lg:col-span-2">
        <MagnifyingGlass className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Pesquisar por título, ID ou técnico"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>
      <select
        className={selectClass}
        value={zoneFilter}
        onChange={(event) => onZoneFilterChange(event.target.value)}
      >
        <option value="todos">Todas as zonas</option>
        {zones.map((zone) => (
          <option key={zone} value={zone}>
            {zone}
          </option>
        ))}
      </select>
      <select
        className={selectClass}
        value={priorityFilter}
        onChange={(event) => onPriorityFilterChange(event.target.value)}
      >
        <option value="todos">Todas as prioridades</option>
        {priorityOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}