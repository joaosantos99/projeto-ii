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

  const handleSubmit = () => {
    setError("")
    if (!current || !next || !confirm) {
      setError("Preencha todos os campos.")
      return
    }
    if (next !== confirm) {
      setError("A confirmação não coincide com a nova palavra-passe.")
      return
    }
    onChangePassword?.({ current, next })
    setCurrent("")
    setNext("")
    setConfirm("")
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Palavra-passe</CardTitle>
          <CardDescription>
            Substituição da palavra-passe (armazenada como hash).
          </CardDescription>
        </div>
        <Button type="button" size="sm" className="shrink-0" onClick={handleSubmit}>
          Alterar palavra-passe
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
            <FieldDescription>
              Será guardada como hash; nunca em texto simples.
            </FieldDescription>
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
        </FieldGroup>
      </CardContent>
    </Card>
  )
}