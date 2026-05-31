'use client'

import { useEffect, useState } from "react"
import { Button } from "#/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import { selectClass, typeOptions } from "#/data/manutencao"
import { api } from "#/lib/api"

const emptyForm = {
  description: "",
  type: typeOptions[0].value,
  spaceId: "",
  scheduledDate: "",
}

export function CreateTaskDialog({ open, onClose, onCreate }) {
  const [form, setForm] = useState(emptyForm)
  const [spaces, setSpaces] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open) return
    setForm(emptyForm)
    setError(null)
    api.get("/spaces", { params: { perPage: 1000 } })
      .then((res) => setSpaces(res.data?.spaces ?? []))
      .catch(() => setSpaces([]))
  }, [open])

  if (!open) return null

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = () => {
    if (!form.description.trim() || !form.spaceId || !form.scheduledDate) return
    setSubmitting(true)
    setError(null)
    Promise.resolve(
      onCreate({
        green_spaces_id: form.spaceId,
        type: form.type,
        description: form.description.trim(),
        scheduled_date: form.scheduledDate,
        status: "pending",
      }),
    )
      .catch(() => setError("Não foi possível criar a tarefa."))
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
          <h2 className="text-sm font-semibold">Nova tarefa de manutenção</h2>
          <p className="text-xs text-muted-foreground">
            Registe uma ordem de trabalho para um espaço verde.
          </p>
        </div>
        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel htmlFor="task-description">Descrição</FieldLabel>
            <Input
              id="task-description"
              value={form.description}
              placeholder="Ex.: Rega da zona norte"
              onChange={update("description")}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="task-type">Tipo</FieldLabel>
            <select
              id="task-type"
              className={selectClass}
              value={form.type}
              onChange={update("type")}
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field>
            <FieldLabel htmlFor="task-space">Espaço verde</FieldLabel>
            <select
              id="task-space"
              className={selectClass}
              value={form.spaceId}
              onChange={update("spaceId")}
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
            <FieldLabel htmlFor="task-date">Data agendada</FieldLabel>
            <Input
              id="task-date"
              type="date"
              value={form.scheduledDate}
              onChange={update("scheduledDate")}
            />
          </Field>
        </FieldGroup>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "A guardar…" : "Guardar tarefa"}
          </Button>
        </div>
      </div>
    </div>
  )
}
