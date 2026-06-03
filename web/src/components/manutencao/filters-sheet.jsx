'use client'

import { useEffect, useState } from "react"
import { Button } from "#/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field"
import { selectClass, priorityOptions } from "#/data/manutencao"

export function FiltersSheet({
  open,
  onClose,
  zoneFilter,
  onZoneFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  zones,
}) {
  const [draftZone, setDraftZone] = useState(zoneFilter)
  const [draftPriority, setDraftPriority] = useState(priorityFilter)

  useEffect(() => {
    if (open) {
      setDraftZone(zoneFilter)
      setDraftPriority(priorityFilter)
    }
  }, [open, zoneFilter, priorityFilter])

  if (!open) return null

  const handleClear = () => {
    setDraftZone("todos")
    setDraftPriority("todos")
  }

  const handleApply = () => {
    onZoneFilterChange(draftZone)
    onPriorityFilterChange(draftPriority)
    onClose()
  }

  const handleClose = () => {
    setDraftZone(zoneFilter)
    setDraftPriority(priorityFilter)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50"
      onClick={handleClose}
    >
      <aside
        className="flex h-full w-full max-w-sm flex-col bg-background ring-1 ring-foreground/10"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex flex-col gap-1 border-b px-4 py-4">
          <h2 className="text-sm font-semibold">Filtrar tarefas</h2>
          <p className="text-xs text-muted-foreground">
            Refine o kanban por zona e prioridade.
          </p>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="filter-zone">Zona</FieldLabel>
              <select
                id="filter-zone"
                className={selectClass}
                value={draftZone}
                onChange={(event) => setDraftZone(event.target.value)}
              >
                <option value="todos">Todas as zonas</option>
                {zones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </Field>
            <Field>
              <FieldLabel htmlFor="filter-priority">Prioridade</FieldLabel>
              <select
                id="filter-priority"
                className={selectClass}
                value={draftPriority}
                onChange={(event) => setDraftPriority(event.target.value)}
              >
                <option value="todos">Todas as prioridades</option>
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </FieldGroup>
        </div>

        <footer className="flex items-center justify-between border-t px-4 py-3">
          <Button variant="ghost" onClick={handleClear}>
            Limpar filtros
          </Button>
          <Button onClick={handleApply}>Aplicar filtros</Button>
        </footer>
      </aside>
    </div>
  )
}
