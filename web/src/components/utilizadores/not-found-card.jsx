import { Link } from "react-router-dom"
import { Button } from "#/components/ui/button"

export function NotFoundCard() {
  return (
    <div className="flex justify-center py-8">
      <div className="flex max-w-md flex-col items-center gap-3 rounded-none border border-dashed bg-card p-6 text-center ring-1 ring-foreground/10">
        <p className="text-sm font-semibold">Utilizador não encontrado</p>
        <p className="text-xs text-muted-foreground">
          Não foi possível obter o registo solicitado.
        </p>
        <Button asChild size="sm">
          <Link to="/admin/utilizadores">Voltar à lista</Link>
        </Button>
      </div>
    </div>
  )
}
