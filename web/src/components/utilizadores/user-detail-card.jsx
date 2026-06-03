'use client'

import { useState } from "react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { Button } from "#/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import { selectClass } from "#/data/manutencao"

function DetailField({ label, value, mono }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={mono ? "font-mono text-sm text-foreground" : "text-sm text-foreground"}>
        {value}
      </p>
    </div>
  )
}

export function UserDetailCard({ user, roleOptions, values, onChange, onSave, onCancel, saving }) {
  const [editing, setEditing] = useState(false)

  const roleLabel = roleOptions?.find((o) => o.value === user.role)?.label ?? user.role

  const handleField = (key) => (event) => onChange(key, event.target.value)

  const handleEdit = () => setEditing(true)

  const handleCancel = () => {
    onCancel()
    setEditing(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!values.name.trim() || !values.email.trim()) return
    try {
      await onSave()
      setEditing(false)
    } catch {
      // stay in edit mode on error
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">
            {editing ? "Editar utilizador" : "Detalhes da conta"}
          </CardTitle>
          {!editing && (
            <Button type="button" variant="outline" size="sm" onClick={handleEdit}>
              Editar
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {editing ? (
            <FieldGroup className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="edit-id">ID</FieldLabel>
                <Input id="edit-id" value={user.id} disabled />
              </Field>
              <Field>
                <FieldLabel htmlFor="edit-name">Nome completo</FieldLabel>
                <Input
                  id="edit-name"
                  value={values.name}
                  onChange={handleField("name")}
                  autoComplete="name"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="edit-email">Email</FieldLabel>
                <Input
                  id="edit-email"
                  type="email"
                  value={values.email}
                  onChange={handleField("email")}
                  autoComplete="email"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="edit-role">Role</FieldLabel>
                <select
                  id="edit-role"
                  className={selectClass}
                  value={values.role}
                  onChange={handleField("role")}
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
            </FieldGroup>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              <DetailField label="ID" value={user.id} mono />
              <DetailField label="Nome completo" value={user.name} />
              <DetailField label="Email" value={user.email} />
              <DetailField label="Role" value={roleLabel} />
            </div>
          )}
        </CardContent>
        {editing && (
          <CardFooter className="justify-end gap-2 border-[var(--border)]">
            <Button type="button" variant="outline" disabled={saving} onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "A guardar…" : "Guardar alterações"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </form>
  )
}
