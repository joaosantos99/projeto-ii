import { Link } from "react-router-dom"

import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { cn } from "#/lib/utils"

export function ResetPasswordInvalidCard({ className, ...props }) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Link inválido ou expirado</CardTitle>
          <CardDescription>
            Este endereço já não é válido ou o token expirou. Peça um novo email
            de recuperação ou inicie sessão se já tiver uma palavra-passe.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button className="w-full" asChild>
            <Link to="/recuperar-password">Pedir novo link</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/login">Iniciar sessão</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
