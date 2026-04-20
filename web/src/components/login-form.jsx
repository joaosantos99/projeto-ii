import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "#/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import { cn } from "#/lib/utils"

export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: add login endpoint
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
                    to="/recuperar"
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
              <Field>
                <Button type="submit" className="w-full">
                  Iniciar sessão
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Ao continuar, aceita os nossos{" "}
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent p-0 text-primary underline-offset-4 hover:underline"
        >
          Termos de utilização
        </button>{" "}
        e a{" "}
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent p-0 text-primary underline-offset-4 hover:underline"
        >
          Política de privacidade
        </button>
        .
      </FieldDescription>
    </div>
  )
}
