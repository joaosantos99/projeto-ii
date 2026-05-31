'use client'

import { useEffect, useState } from "react"
import { Button } from "#/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field"
import { selectClass } from "#/data/manutencao"
import { api } from "#/lib/api"

const reportTypes = [
  { value: "operational", label: "Operacional" },
  { value: "environmental", label: "Ambiental" },
]

export function GenerateReportDialog({ open, onClose, onGenerate }) {
  const [type, setType] = useState(reportTypes[0].value)
  const [spaceId, setSpaceId] = useState("")
  const [spaces, setSpaces] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open) return
    setType(reportTypes[0].value)
    setSpaceId("")
    setError(null)
    api.get("/spaces", { params: { perPage: 1000 } })
      .then((res) => setSpaces(res.data?.spaces ?? []))
      .catch(() => setSpaces([]))
  }, [open])

  if (!open) return null

  const handleSubmit = () => {
    if (!spaceId) return
    setSubmitting(true)
    setError(null)
    Promise.resolve(onGenerate({ type, greenSpaceId: spaceId }))
      .catch(() => setError("Não foi possível gerar o relatório."))
      .finally(() => setSubmitting(false))
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
            Escolha o espaço verde e o tipo. O relatório aparece no histórico.
          </p>
        </div>
        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel htmlFor="rel-espaco">Espaço verde</FieldLabel>
            <select
              id="rel-espaco"
              className={selectClass}
              value={spaceId}
              onChange={(event) => setSpaceId(event.target.value)}
            >
              <option value="">Selecionar espaço…</option>
              {spaces.map((space) => (
                <option key={space.id} value={space.id}>
                  {space.name}
                </option>
              ))}
            </select>
          </Field>
          <Field>
            <FieldLabel htmlFor="rel-tipo">Tipo de relatório</FieldLabel>
            <select
              id="rel-tipo"
              className={selectClass}
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              {reportTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
        </FieldGroup>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "A gerar…" : "Gerar relatório"}
          </Button>
        </div>
      </div>
    </div>
  )
}
