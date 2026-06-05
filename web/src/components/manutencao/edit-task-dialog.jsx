'use client'

import { useEffect, useState } from "react"
import { Button } from "#/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import { selectClass, typeOptions } from "#/data/manutencao"

export function EditTaskDialog({ open, task, onClose, onSubmit }) {
  const [form, setForm] = useState({ description: "", type: "", scheduledDate: "" })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open || !task) return
    setForm({
      description: task.title ?? "",
      type: task.zone ?? typeOptions[0].value,
      scheduledDate: task.dueDate ?? "",
    })
    setError(null)
    setSubmitting(false)
  }, [open, task])

  if (!open) return null

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = () => {
    if (!form.description.trim() || !form.scheduledDate) return
    setSubmitting(true)
    setError(null)
    Promise.resolve(
      onSubmit({
        type: form.type,
        description: form.description.trim(),
        scheduled_date: form.scheduledDate,
      }),
    )
      .catch(() => setError("Não foi possível guardar a tarefa."))
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
          <h2 className="text-sm font-semibold">Editar tarefa</h2>
          <p className="text-xs text-muted-foreground">
            Atualize os detalhes da ordem de trabalho.
          </p>
        </div>
        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel htmlFor="edit-task-description">Descrição</FieldLabel>
            <Input
              id="edit-task-description"
              value={form.description}
              placeholder="Ex.: Rega da zona norte"
              onChange={update("description")}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="edit-task-type">Tipo</FieldLabel>
            <select
              id="edit-task-type"
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
            <FieldLabel htmlFor="edit-task-date">Data agendada</FieldLabel>
            <Input
              id="edit-task-date"
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
            {submitting ? "A guardar…" : "Guardar"}
          </Button>
        </div>
      </div>
    </div>
  )
}
