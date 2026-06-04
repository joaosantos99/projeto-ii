'use client'

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "#/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import { api } from "#/lib/api"
import { useAuth } from "#/hooks/use-auth"
import { cn } from "#/lib/utils"

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const { data } = await api.post("/users/login", { email, password })
      login(data.token, data.user)
      navigate("/admin")
    } catch (err) {
      setError(err.response?.data?.description ?? "Erro ao iniciar sessão.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem-vindo de volta</CardTitle>
          <CardDescription>
            Introduza o seu email e palavra-passe para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="utilizador@municipio.pt"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Palavra-passe</FieldLabel>
                  <Link
                    to="/admin/recuperar-password"
                    className="ml-auto text-xs text-primary underline-offset-4 hover:underline"
                  >
                    Esqueceu-se da palavra-passe?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
              <Field>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "A iniciar sessão..." : "Iniciar sessão"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Ao continuar, aceita os nossos{" "}
        <Link
          to="/termos-utilizacao"
          className="text-primary !no-underline underline-offset-4 hover:!underline"
        >
          Termos de utilização
        </Link>{" "}
        e a{" "}
        <Link
          to="/politica-privacidade"
          className="text-primary !no-underline underline-offset-4 hover:!underline"
        >
          Política de privacidade
        </Link>
        .
      </FieldDescription>
    </div>
  )
}