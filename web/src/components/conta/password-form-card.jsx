'use client'

import { useState } from "react"
import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "#/components/ui/field"
import { Input } from "#/components/ui/input"

export function PasswordFormCard({ onChangePassword }) {
  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSubmit = () => {
    setError("")
    setSuccess("")
    if (!current || !next || !confirm) {
      setError("Preencha todos os campos.")
      return
    }
    if (next.length < 10) {
      setError("A nova palavra-passe deve ter pelo menos 10 caracteres.")
      return
    }
    if (next !== confirm) {
      setError("A confirmação não coincide com a nova palavra-passe.")
      return
    }
    setSaving(true)
    Promise.resolve(onChangePassword?.({ current, next }))
      .then(() => {
        setSuccess("Palavra-passe alterada com sucesso.")
        setCurrent("")
        setNext("")
        setConfirm("")
      })
      .catch((err) => {
        setError(err?.response?.data?.description ?? "Não foi possível alterar a palavra-passe.")
      })
      .finally(() => setSaving(false))
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Palavra-passe</CardTitle>
          <CardDescription>
            Substituição da palavra-passe.
          </CardDescription>
        </div>
        <Button type="button" size="sm" className="shrink-0" onClick={handleSubmit} disabled={saving}>
          {saving ? "A alterar…" : "Alterar palavra-passe"}
        </Button>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="current-password">Palavra-passe atual</FieldLabel>
            <Input
              id="current-password"
              type="password"
              value={current}
              onChange={(event) => setCurrent(event.target.value)}
              autoComplete="current-password"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="new-password">Nova palavra-passe</FieldLabel>
            <Input
              id="new-password"
              type="password"
              value={next}
              onChange={(event) => setNext(event.target.value)}
              autoComplete="new-password"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm-password">
              Confirmar nova palavra-passe
            </FieldLabel>
            <Input
              id="confirm-password"
              type="password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              autoComplete="new-password"
            />
          </Field>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {success ? <p className="text-sm text-green-600">{success}</p> : null}
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
