import { MagnifyingGlass } from "@phosphor-icons/react"
import { Input } from "#/components/ui/input"
import { selectClass } from "#/data/manutencao"
import { operationalStatusOptions } from "#/data/espacos"

export function FiltersBar({
  query,
  onQueryChange,
  districtFilter,
  onDistrictFilterChange,
  statusFilter,
  onStatusFilterChange,
  districtOptions,
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative max-w-md flex-1">
        <MagnifyingGlass className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          aria-label="Pesquisar espaços"
          placeholder="Pesquisar por nome, cidade ou distrito..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label="Distrito"
          className={`${selectClass} h-9 text-sm sm:w-48`}
          value={districtFilter}
          onChange={(event) => onDistrictFilterChange(event.target.value)}
        >
          <option value="todos">Todos os distritos</option>
          {districtOptions.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
        <select
          aria-label="Estado operacional"
          className={`${selectClass} h-9 text-sm sm:w-44`}
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
        >
          <option value="todos">Todos os estados</option>
          {operationalStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
