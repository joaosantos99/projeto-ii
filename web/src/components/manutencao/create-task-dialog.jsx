'use client'

import { useState } from "react"
import { Button } from "#/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import { selectClass, zoneOptions, priorityOptions } from "#/data/manutencao"

export function CreateTaskDialog({ open, onClose, onCreate }) {
  const [title, setTitle] = useState("")
  const [zone, setZone] = useState(zoneOptions[0])
  const [priority, setPriority] = useState("normal")

  if (!open) return null

  const handleSubmit = () => {
    if (!title.trim()) return
    onCreate({ title, zone, priority })
    setTitle("")
    setZone(zoneOptions[0])
    setPriority("normal")
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
            Registe uma tarefa para uma equipa técnica com prioridade e zona.
          </p>
        </div>
        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel htmlFor="task-title">Descrição</FieldLabel>
            <Input
              id="task-title"
              value={title}
              placeholder="Ex.: Rega da zona norte"
              onChange={(event) => setTitle(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="task-zone">Zona</FieldLabel>
            <select
              id="task-zone"
              className={selectClass}
              value={zone}
              onChange={(event) => setZone(event.target.value)}
            >
              {zoneOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
          <Field>
            <FieldLabel htmlFor="task-priority">Prioridade</FieldLabel>
            <select
              id="task-priority"
              className={selectClass}
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              {priorityOptions.map((option) => (
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
          <Button onClick={handleSubmit}>Guardar tarefa</Button>
        </div>
      </div>
    </div>
  )
}