'use client'

import { Link } from "react-router-dom"
import { Eye } from "@phosphor-icons/react"
import { Button } from "#/components/ui/button"

export function SpacesTable({ spaces }) {
  if (spaces.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Sem resultados para os filtros atuais.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b text-left text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">Nome</th>
            <th className="px-3 py-2 font-medium">Cidade</th>
            <th className="px-3 py-2 text-right font-medium">Zonas</th>
            <th className="px-3 py-2 text-right font-medium">Sensores</th>
            <th className="px-3 py-2 text-right font-medium">Alertas ativos</th>
            <th className="w-12 px-3 py-2 text-right font-medium">
              <span className="sr-only">Ver detalhe</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {spaces.map((space) => (
            <tr key={space.id} className="border-b last:border-b-0">
              <td className="px-3 py-2">
                <div className="flex flex-col gap-0.5">
                  <p className="font-medium">{space.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {space.postalCode}
                  </p>
                </div>
              </td>
              <td className="px-3 py-2">{space.city}</td>
              <td className="px-3 py-2 text-right tabular-nums">{space.zonesCount}</td>
              <td className="px-3 py-2 text-right tabular-nums">{space.sensorsCount}</td>
              <td className="px-3 py-2 text-right tabular-nums">{space.activeAlerts}</td>
              <td className="px-3 py-2 text-right">
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
