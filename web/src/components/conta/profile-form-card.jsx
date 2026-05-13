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

  const handleSave = () => {
    if (!fullName.trim() || !email.trim()) return
    onSave?.({ name: fullName.trim(), email: email.trim() })
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
        <Button type="button" size="sm" className="shrink-0" onClick={handleSave}>
          Guardar dados
        </Button>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="user-full-name">Nome completo</FieldLabel>
            <Input
              id="user-full-name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              autoComplete="name"
            />
            <FieldDescription>
              Identificação do utilizador no sistema.
            </FieldDescription>
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
            <FieldDescription>
              Endereço para contacto e início de sessão.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
