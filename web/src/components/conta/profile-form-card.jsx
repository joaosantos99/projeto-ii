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

export function ProfileFormCard({
  initialName = "",
  initialEmail = "",
  onSave,
}) {
  const [fullName, setFullName] = useState(initialName)
  const [email, setEmail] = useState(initialEmail)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const handleSave = () => {
    if (!fullName.trim() || !email.trim()) return
    setSaving(true)
    setFeedback(null)
    Promise.resolve(onSave?.({ name: fullName.trim(), email: email.trim() }))
      .then(() => setFeedback({ type: "ok", text: "Dados atualizados." }))
      .catch(() => setFeedback({ type: "error", text: "Não foi possível guardar os dados." }))
      .finally(() => setSaving(false))
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Dados do utilizador</CardTitle>
          <CardDescription>
            Nome completo e email associados ao registo.
          </CardDescription>
        </div>
        <Button type="button" size="sm" className="shrink-0" onClick={handleSave} disabled={saving}>
          {saving ? "A guardar…" : "Guardar dados"}
        </Button>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          {feedback ? (
            <p className={feedback.type === "ok" ? "text-sm text-green-600" : "text-sm text-destructive"}>
              {feedback.text}
            </p>
          ) : null}
          <Field>
            <FieldLabel htmlFor="user-full-name">Nome completo</FieldLabel>
            <Input
              id="user-full-name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              autoComplete="name"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="user-email">Email</FieldLabel>
            <Input
              id="user-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
