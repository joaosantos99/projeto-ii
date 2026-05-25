'use client'

import { useState } from "react"
import { Button } from "#/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"

export function CreateRoleDialog({ open, onClose, onCreate, saving }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState(null)

  if (!open) return null

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedDescription = description.trim()
    if (!trimmedName) {
      setError("Indique um nome para a role.")
      return
    }
    if (!trimmedDescription) {
      setError("Indique uma descrição.")
      return
    }
    setError(null)
    onCreate({ name: trimmedName, description: trimmedDescription })
  }

  const handleClose = () => {
    setName("")
    setDescription("")
    setError(null)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <form
        className="w-full max-w-md bg-background ring-1 ring-foreground/10 p-5 flex flex-col gap-4"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold">Criar role</h2>
          <p className="text-xs text-muted-foreground">
            Define um nome e descrição; começa sem permissões e pode ativá-las
            já a seguir.
          </p>
        </div>
        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel htmlFor="new-role-name">Nome da role</FieldLabel>
            <Input
              id="new-role-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex.: Gestor de campo"
              autoComplete="off"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="new-role-description">Descrição</FieldLabel>
            <Input
              id="new-role-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Ex.: Coordena equipas no terreno"
              autoComplete="off"
            />
          </Field>
          {error ? (
            <p className="text-destructive text-xs">{error}</p>
          ) : null}
        </FieldGroup>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "A criar..." : "Criar e editar permissões"}
          </Button>
        </div>
      </form>
    </div>
  )
}
