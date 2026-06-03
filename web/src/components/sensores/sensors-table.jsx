'use client'

import { Link } from "react-router-dom"
import { Eye } from "@phosphor-icons/react"

import { Button } from "#/components/ui/button"
import { SensorStatusBadge } from "#/components/sensores/status-badge"
import { sensorStatus, sensorTypeLabels } from "#/data/sensores"

export function SensorsTable({ sensors, filterActive }) {
  if (sensors.length === 0) {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center gap-1 border border-dashed p-6 text-center">
        <p className="text-sm font-medium">Nenhum sensor encontrado</p>
        <p className="text-xs text-muted-foreground">
          {filterActive
            ? "Ajuste a pesquisa ou os filtros para alargar os critérios."
            : "Ainda não existem sensores registados."}
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="pb-2 pr-4 font-medium">Sensor</th>
            <th className="pb-2 pr-4 font-medium">Espaço</th>
            <th className="pb-2 pr-4 font-medium">Zona</th>
            <th className="pb-2 pr-4 text-right font-medium">Intervalo</th>
            <th className="pb-2 pr-4 font-medium">Estado</th>
            <th className="pb-2 text-right font-medium">
              <span className="sr-only">Ver espaço</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sensors.map((sensor) => (
            <tr key={sensor.id} className="border-b border-border last:border-0">
              <td className="py-2.5 pr-4 font-medium">
                {sensorTypeLabels[sensor.type] ?? sensor.type}
              </td>
              <td className="py-2.5 pr-4">{sensor.spaceName ?? "—"}</td>
              <td className="py-2.5 pr-4 text-muted-foreground">
                {sensor.zoneName ?? "—"}
              </td>
              <td className="py-2.5 pr-4 text-right tabular-nums">
                {sensor.minValue}–{sensor.maxValue}
                {sensor.unit ? ` ${sensor.unit}` : ""}
              </td>
              <td className="py-2.5 pr-4">
                <SensorStatusBadge status={sensorStatus(sensor)} />
              </td>
              <td className="py-2.5 text-right">
                {sensor.spaceId ? (
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    aria-label={`Ver espaço de ${sensorTypeLabels[sensor.type] ?? sensor.type}`}
                  >
                    <Link to={`/admin/espacos/${sensor.spaceId}/sensores`}>
                      <Eye />
                    </Link>
                  </Button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
