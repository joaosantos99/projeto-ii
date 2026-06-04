'use client'

import { useEffect, useState } from "react"
import { Button } from "#/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import { selectClass } from "#/data/manutencao"

export function CreateUserDialog({ open, onClose, onCreate, roleOptions }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Keep the selected role valid against the loaded options.
  useEffect(() => {
    if (!roleOptions.some((option) => option.value === role)) {
      setRole(roleOptions[0]?.value ?? "")
    }
  }, [roleOptions, role])

  if (!open) return null

  const reset = () => {
    setName("")
    setEmail("")
    setPassword("")
    setRole(roleOptions[0]?.value ?? "")
    setError("")
  }

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) return
    if (password.length < 10) {
      setError("A palavra-passe deve ter pelo menos 10 caracteres.")
      return
    }
    setSubmitting(true)
    setError("")
    try {
      await onCreate({
        fullName: name.trim(),
        email: email.trim(),
        password,
        role,
      })
      reset()
    } catch (err) {
      setError(
        err?.response?.data?.description ?? "Não foi possível criar o utilizador."
      )
    } finally {
      setSubmitting(false)
    }
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
          <h2 className="text-sm font-semibold">Criar utilizador</h2>
          <p className="text-xs text-muted-foreground">
            Registe uma nova conta no backoffice.
          </p>
        </div>
        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel htmlFor="new-user-name">Nome completo</FieldLabel>
            <Input
              id="new-user-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex.: Maria Santos"
              autoComplete="name"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="new-user-email">Email</FieldLabel>
            <Input
              id="new-user-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nome@municipio.pt"
              autoComplete="email"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="new-user-password">Palavra-passe</FieldLabel>
            <Input
              id="new-user-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mínimo 10 caracteres"
              autoComplete="new-password"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="new-user-role">Perfil</FieldLabel>
            <select
              id="new-user-role"
              className={selectClass}
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
        </FieldGroup>
        {error ? (
          <p className="text-xs text-destructive">{error}</p>
        ) : null}
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