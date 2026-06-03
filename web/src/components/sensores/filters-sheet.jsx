'use client'

import { useEffect, useState } from "react"

import { Button } from "#/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field"
import { selectClass } from "#/data/manutencao"
import { SENSOR_TYPE_OPTIONS } from "#/data/sensores"

export function SensorsFiltersSheet({
  open,
  onClose,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
}) {
  const [draftStatus, setDraftStatus] = useState(statusFilter)
  const [draftType, setDraftType] = useState(typeFilter)

  useEffect(() => {
    if (open) {
      setDraftStatus(statusFilter)
      setDraftType(typeFilter)
    }
  }, [open, statusFilter, typeFilter])

  if (!open) return null

  const handleClear = () => {
    setDraftStatus("todos")
    setDraftType("todos")
  }

  const handleApply = () => {
    onStatusFilterChange(draftStatus)
    onTypeFilterChange(draftType)
    onClose()
  }

  const handleClose = () => {
    setDraftStatus(statusFilter)
    setDraftType(typeFilter)
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
          <h2 className="text-sm font-semibold">Filtrar sensores</h2>
          <p className="text-xs text-muted-foreground">
            Refine a tabela por estado e tipo.
          </p>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="filter-status">Estado</FieldLabel>
              <select
                id="filter-status"
                className={selectClass}
                value={draftStatus}
                onChange={(event) => setDraftStatus(event.target.value)}
              >
                <option value="todos">Todos os estados</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </Field>
            <Field>
              <FieldLabel htmlFor="filter-type">Tipo de sensor</FieldLabel>
              <select
                id="filter-type"
                className={selectClass}
                value={draftType}
                onChange={(event) => setDraftType(event.target.value)}
              >
                <option value="todos">Todos os tipos</option>
                {SENSOR_TYPE_OPTIONS.map((option) => (
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
