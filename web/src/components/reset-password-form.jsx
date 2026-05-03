import { useState } from "react"
import { Link } from "react-router-dom"

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
import { cn } from "#/lib/utils"

const MIN_LENGTH = 8

export function ResetPasswordForm({ token, className, ...props }) {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [formError, setFormError] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError(null)

    if (password.length < MIN_LENGTH) {
      setFormError("short")
      return
    }

    if (password !== confirm) {
      setFormError("mismatch")
      return
    }

    // Replace with fetch('/api/auth/reset-password', …)
    await Promise.resolve({ token, password })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Palavra-passe atualizada</CardTitle>
            <CardDescription>
              A sua palavra-passe foi alterada. Já pode iniciar sessão com a
              nova palavra-passe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link to="/login">Iniciar sessão</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Nova palavra-passe</CardTitle>
          <CardDescription>
            Escolha uma palavra-passe forte. Não a partilhe com terceiros.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field data-invalid={formError === "short" ? true : undefined}>
                <FieldLabel htmlFor="reset-password">
                  Nova palavra-passe
                </FieldLabel>
                <Input
                  id="reset-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setFormError(null)
                  }}
                  required
                />
                <FieldDescription>
                  Mínimo de {MIN_LENGTH} caracteres.
                </FieldDescription>
              </Field>
              <Field data-invalid={formError === "mismatch" ? true : undefined}>
                <FieldLabel htmlFor="reset-password-confirm">
                  Confirmar palavra-passe
                </FieldLabel>
                <Input
                  id="reset-password-confirm"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value)
                    setFormError(null)
                  }}
                  required
                />
                {formError === "mismatch" ? (
                  <FieldDescription>
                    As palavras-passe não coincidem.
                  </FieldDescription>
                ) : null}
              </Field>
              <Field>
                <Button type="submit" className="w-full">
                  Guardar palavra-passe
                </Button>
                <FieldDescription className="text-center">
                  <Link
                    to="/login"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Voltar ao início de sessão
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
