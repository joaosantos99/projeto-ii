'use client'

import { useEffect, useState } from "react"

import { Button } from "#/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field"
import { selectClass } from "#/data/manutencao"

const severityOptions = [
  { value: "critical", label: "Crítico" },
  { value: "warning", label: "Aviso" },
  { value: "normal", label: "Normal" },
]

const statusOptions = [
  { value: "pending", label: "Por confirmar" },
  { value: "confirmed", label: "Confirmados" },
]

export function FiltersSheet({
  open,
  onClose,
  severityFilter,
  onSeverityFilterChange,
  statusFilter,
  onStatusFilterChange,
}) {
  const [draftSeverity, setDraftSeverity] = useState(severityFilter)
  const [draftStatus, setDraftStatus] = useState(statusFilter)

  useEffect(() => {
    if (open) {
      setDraftSeverity(severityFilter)
      setDraftStatus(statusFilter)
    }
  }, [open, severityFilter, statusFilter])

  if (!open) return null

  const handleClear = () => {
    setDraftSeverity("todas")
    setDraftStatus("todos")
  }

  const handleApply = () => {
    onSeverityFilterChange(draftSeverity)
    onStatusFilterChange(draftStatus)
    onClose()
  }

  const handleClose = () => {
    setDraftSeverity(severityFilter)
    setDraftStatus(statusFilter)
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
          <h2 className="text-sm font-semibold">Filtrar alertas</h2>
          <p className="text-xs text-muted-foreground">
            Refine a tabela por severidade e estado.
          </p>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="filter-severity">Severidade</FieldLabel>
              <select
                id="filter-severity"
                className={selectClass}
                value={draftSeverity}
                onChange={(event) => setDraftSeverity(event.target.value)}
              >
                <option value="todas">Todas as severidades</option>
                {severityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field>
              <FieldLabel htmlFor="filter-status">Estado</FieldLabel>
              <select
                id="filter-status"
                className={selectClass}
                value={draftStatus}
                onChange={(event) => setDraftStatus(event.target.value)}
              >
                <option value="todos">Todos os estados</option>
                {statusOptions.map((option) => (
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
