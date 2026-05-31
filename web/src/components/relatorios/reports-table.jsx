'use client'

import { Download } from "@phosphor-icons/react"
import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import { statusLabels, typeLabels } from "#/data/relatorios"

export function ReportsTable({ reports, onExport }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b text-left text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">ID</th>
            <th className="px-3 py-2 font-medium">Tipo</th>
            <th className="px-3 py-2 font-medium">Âmbito</th>
            <th className="px-3 py-2 font-medium">Período</th>
            <th className="px-3 py-2 font-medium">Criado</th>
            <th className="px-3 py-2 font-medium">Estado</th>
            <th className="px-3 py-2 text-right font-medium">Exportar</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id} className="border-b last:border-b-0">
              <td className="px-3 py-2 font-medium">{report.id}</td>
              <td className="px-3 py-2">{typeLabels[report.type]}</td>
              <td className="px-3 py-2">{report.scope}</td>
              <td className="px-3 py-2">{report.period}</td>
              <td className="px-3 py-2 tabular-nums text-muted-foreground">
                {report.createdAt}
              </td>
              <td className="px-3 py-2">
                <Badge variant={report.status === "gerado" ? "secondary" : "outline"}>
                  {statusLabels[report.status]}
                </Badge>
              </td>
              <td className="px-3 py-2 text-right">
                <Button size="sm" variant="ghost" onClick={() => onExport?.(report.id)}>
                  <Download />
                  CSV
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}