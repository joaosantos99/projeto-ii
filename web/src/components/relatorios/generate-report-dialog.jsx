'use client'

import { useState } from "react"
import { Button } from "#/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import { selectClass } from "#/data/manutencao"
import { typeOptions } from "#/data/relatorios"

export function GenerateReportDialog({ open, onClose, onGenerate }) {
  const [rangeStart, setRangeStart] = useState("2026-03-01")
  const [rangeEnd, setRangeEnd] = useState("2026-03-23")
  const [type, setType] = useState("operacional")

  if (!open) return null

  const handleSubmit = () => {
    onGenerate({ rangeStart, rangeEnd, type })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-background ring-1 ring-foreground/10 p-5 flex flex-col gap-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold">Gerar relatório</h2>
          <p className="text-xs text-muted-foreground">
            Escolha o período e o tipo. O relatório fica agendado e aparece no
            histórico.
          </p>
        </div>
        <FieldGroup className="gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="rel-inicio">Data inicial</FieldLabel>
              <Input
                id="rel-inicio"
                type="date"
                value={rangeStart}
                onChange={(event) => setRangeStart(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="rel-fim">Data final</FieldLabel>
              <Input
                id="rel-fim"
                type="date"
                value={rangeEnd}
                onChange={(event) => setRangeEnd(event.target.value)}
              />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="rel-tipo">Tipo de relatório</FieldLabel>
            <select
              id="rel-tipo"
              className={selectClass}
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
        </FieldGroup>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Agendar geração</Button>
        </div>
      </div>
    </div>
  )
}