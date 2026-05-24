import { useState, useMemo } from "react"
import { Alarm, CheckCircle, MagnifyingGlass } from "@phosphor-icons/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"
import { Button } from "#/components/ui/button"
import { Badge } from "#/components/ui/badge"
import { cn } from "#/lib/utils"
import { Input } from "#/components/ui/input"

const spaces = [
  { id: 1, name: "Parque Florestal de Monsanto", city: "Lisboa", zones: 4, sensors: 4, spaces: 3, status: "Ativo" },
  { id: 2, name: "Mata Nacional do Bucaco", city: "Mealhada", zones: 2, sensors: 4, spaces: 2, status: "Ativo" },
  { id: 3, name: "Jardins do Palacio de Cristal", city: "Porto", zones: 2, sensors: 4, spaces: 0, status: "Manutencao" },
]

const PAGE_SIZE = 4

export function SpacesWidget() {
  const [page, setPage] = useState(1)

  const sorted = useMemo(() => {
    const rank = { critical: 3, warning: 2, normal: 1 }
    return [...spaces].sort((a, b) => (rank[b.severity] ?? 0) - (rank[a.severity] ?? 0))
  }, [])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <section>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle>Espaços Verdes</CardTitle>
            <CardDescription>Filtre por perfil e estado, depois faça a gestao de acessos.</CardDescription>
          </div>
          <div className="grid grid-cols-1 md:flex gap-2 items-center">
            <div className="relative">
                <MagnifyingGlass className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input placeholder="Pesquisar por nome ou cidade" className="pl-7" />
            </div>
            <div className="md:flex gap-2">
                <Button variant="outline" size="sm">
                    <Alarm className="size-3.5" />
                    Filtros
                </Button>
                <Button size="sm">
                    <Alarm className="size-3.5" />
                    Novo espaço
                </Button>
            </div>

          </div>

        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Nome</th>
                  <th className="pb-2 pr-4 font-medium">Cidade</th>
                  <th className="pb-2 pr-4 font-medium">Zonas</th>
                  <th className="pb-2 pr-4 font-medium">Sensores</th>
                  <th className="pb-2 text-right font-medium">Alertas activos</th>
                  <th className="pb-2 text-right font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((space) => (
                  <tr key={space.id} className="border-b border-border last:border-0">
                    <td className="py-2.5 pr-4">{space.name}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{space.city}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{space.zones}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{space.sensors}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{space.spaces}</td>
                    <td className="py-2.5 pr-4">
                        <Badge variant={space.status === "Ativo" ? "default" : "secondary"}>
                            {space.status}
                        </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              {sorted.length} espaço(s) encontrados - pagina {currentPage} de {totalPages}
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
