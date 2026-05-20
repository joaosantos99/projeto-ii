import { Link } from "react-router-dom"
import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"

export function NotFoundCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Espaço não encontrado</CardTitle>
        <CardDescription>
          O identificador não corresponde a nenhum registo ativo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link to="/dashboard/espacos">Voltar à lista</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
