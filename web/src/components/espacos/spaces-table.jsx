'use client'

import { Link } from "react-router-dom"
import { Eye } from "@phosphor-icons/react"
import { Button } from "#/components/ui/button"

export function SpacesTable({ spaces }) {
  if (spaces.length === 0) {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center gap-1 border border-dashed p-6 text-center">
        <p className="text-sm font-medium">Nenhum espaço encontrado</p>
        <p className="text-xs text-muted-foreground">
          Ajuste a pesquisa para alargar os resultados.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="pb-2 pr-4 font-medium">Nome</th>
            <th className="pb-2 pr-4 font-medium">Freguesia</th>
            <th className="pb-2 pr-4 text-right font-medium">Zonas</th>
            <th className="pb-2 pr-4 text-right font-medium">Sensores</th>
            <th className="pb-2 pr-4 text-right font-medium">Alertas ativos</th>
            <th className="pb-2 text-right font-medium">
              <span className="sr-only">Ver detalhe</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {spaces.map((space) => (
            <tr key={space.id} className="border-b border-border last:border-0">
              <td className="py-2.5 pr-4">
                <div className="flex flex-col gap-0.5">
                  <p className="font-medium">{space.name}</p>
                  <p className="text-muted-foreground">{space.postalCode}</p>
                </div>
              </td>
              <td className="py-2.5 pr-4 text-muted-foreground">{space.parish}</td>
              <td className="py-2.5 pr-4 text-right tabular-nums">{space.zonesCount}</td>
              <td className="py-2.5 pr-4 text-right tabular-nums">{space.sensorsCount}</td>
              <td className="py-2.5 pr-4 text-right tabular-nums">{space.activeAlerts}</td>
              <td className="py-2.5 text-right">
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  aria-label={`Ver ficha de ${space.name}`}
                >
                  <Link to={`/admin/espacos/${space.id}`}>
                    <Eye />
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
