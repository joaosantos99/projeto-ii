import { useState, useMemo } from "react"
import { Alarm, CheckCircle } from "@phosphor-icons/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"
import { Button } from "#/components/ui/button"
import { Badge } from "#/components/ui/badge"
import { cn } from "#/lib/utils"

const alerts = [
  { id: "ALR-8812", rule: "Ruido elevado prolongado", space: "Parque Florestal de Monsanto", severity: "critical", happenedAt: "2026-03-23 09:10", acknowledged: false },
  { id: "ALR-8798", rule: "Humidade abaixo de 35%", space: "Parque da Cidade", severity: "critical", happenedAt: "2026-03-22 22:19", acknowledged: false },
  { id: "ALR-8806", rule: "Temperatura acima do limite", space: "Mata Nacional do Bucaco", severity: "warning", happenedAt: "2026-03-23 08:24", acknowledged: true },
]

const PAGE_SIZE = 4

export function AlertasWidget() {
  const [page, setPage] = useState(1)

  const sorted = useMemo(() => {
    const rank = { critical: 3, warning: 2, normal: 1 }
    return [...alerts].sort((a, b) => (rank[b.severity] ?? 0) - (rank[a.severity] ?? 0))
  }, [])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <section>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle>Alertas ativos</CardTitle>
            <CardDescription>Lista priorizada por severidade com acao imediata</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Alarm className="size-3.5" />
            Ver todos
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Regra</th>
                  <th className="pb-2 pr-4 font-medium">Espaco</th>
                  <th className="pb-2 pr-4 font-medium">Severidade</th>
                  <th className="pb-2 pr-4 font-medium">Data</th>
                  <th className="pb-2 text-right font-medium">Acao</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((alert) => (
                  <tr key={alert.id} className="border-b border-border last:border-0">
                    <td className="py-2.5 pr-4">{alert.rule}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{alert.space}</td>
                    <td className="py-2.5 pr-4">
                      <Badge variant={alert.severity === "critical" ? "destructive" : "warning"}>
                        {alert.severity === "critical" ? "Critico" : "Warning"}
                      </Badge>
                    </td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{alert.happenedAt}</td>
                    <td className="py-2.5 text-right">
                      <Button
                        size="xs"
                        variant={alert.acknowledged ? "secondary" : "outline"}
                        className={alert.acknowledged ? "bg-green-50 text-green-700 ring-1 ring-green-200 hover:bg-green-100" : ""}
                      >
                        {alert.acknowledged ? (
                          <>
                            <CheckCircle className="size-3" />
                            Confirmado
                          </>
                        ) : (
                          <>
                            <Alarm className="size-3" />
                            Confirmar
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              {sorted.length} alerta(s) encontrados - pagina {currentPage} de {totalPages}
            </p>
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-none px-2 py-1 text-xs text-muted-foreground ring-1 ring-border hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              >
                &lt; Anterior
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={cn(
                    "flex size-6 items-center justify-center rounded-none text-xs ring-1",
                    currentPage === i + 1
                      ? "bg-primary text-primary-foreground ring-primary"
                      : "ring-border hover:bg-muted"
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 rounded-none px-2 py-1 text-xs text-muted-foreground ring-1 ring-border hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              >
                Seguinte &gt;
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
