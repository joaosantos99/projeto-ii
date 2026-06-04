'use client'

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "#/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import { cn } from "#/lib/utils"

export function ForgotPasswordForm({ className, ...props }) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const apiUrl = import.meta.env.VITE_API_URL ?? ''
      const response = await fetch(`${apiUrl}/api/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.description || 'Erro ao enviar email')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Verifique o seu email</CardTitle>
            <CardDescription>
              Se existir uma conta associada a{" "}
              <span className="font-medium text-foreground">{email}</span>,
              enviámos instruções para redefinir a palavra-passe. Utilize o link
              do email (abre a página de nova palavra-passe). O link expira em
              algumas horas.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FieldDescription className="text-center text-muted-foreground">
              Não recebeu o email? Verifique a pasta de spam ou tente novamente
              dentro de alguns minutos.
            </FieldDescription>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/admin/login">Voltar ao início de sessão</Link>
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
          <CardTitle className="text-xl">Recuperar palavra-passe</CardTitle>
          <CardDescription>
            Indique o email da sua conta. Se estiver registado, receberá um link
            para criar uma nova palavra-passe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="recuperar-email">Email</FieldLabel>
                <Input
                  id="recuperar-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="utilizador@municipio.pt"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              {error && (
                <FieldDescription className="text-center text-red-600">
                  {error}
                </FieldDescription>
              )}
              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'A enviar...' : 'Enviar instruções'}
                </Button>
                <FieldDescription className="text-center">
                  <Link
                    to="/admin/login"
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