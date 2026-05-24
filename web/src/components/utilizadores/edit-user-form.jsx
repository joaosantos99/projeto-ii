'use client'

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

export function EditUserForm({ userId, values, onChange, onSubmit, saving, roleOptions }) {
  const handleField = (key) => (event) => onChange(key, event.target.value)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!values.name.trim() || !values.email.trim()) return
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Editar utilizador</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="edit-id">ID</FieldLabel>
              <Input id="edit-id" value={userId} disabled />
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
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? "A guardar…" : "Guardar alterações"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}