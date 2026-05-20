import { useEffect, useState } from "react"
import { Button } from "#/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"

export function AddZoneDialog({ open, spaceName, onClose, onSubmit }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (open) {
      setName("")
      setDescription("")
    }
  }, [open])

  if (!open) return null

  const handleSubmit = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    onSubmit({ name: trimmed, description: description.trim() || "—" })
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
          <h2 className="text-sm font-semibold">Nova zona</h2>
          <p className="text-xs text-muted-foreground">
            Defina uma subdivisão monitorizada em {spaceName}. A descrição é
            opcional.
          </p>
        </div>
        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel htmlFor="zone-name">Nome da zona</FieldLabel>
            <Input
              id="zone-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex.: Zona Norte"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="zone-desc">Descrição</FieldLabel>
            <Input
              id="zone-desc"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Contexto ou notas operacionais"
            />
          </Field>
        </FieldGroup>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  )
}
