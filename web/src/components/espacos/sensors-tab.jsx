'use client'

import { Broadcast, Plus } from "@phosphor-icons/react"
import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { sensorStatusLabels } from "#/data/espacos"

function statusVariant(status) {
  if (status === "offline") return "destructive"
  if (status === "degradado") return "outline"
  return "secondary"
}

export function SensorsTab({ sensors, hasZones, onAdd }) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle className="flex items-center gap-2 text-base">
            <Broadcast />
            Inventário de sensores
          </CardTitle>
          <CardDescription>
            Sensores associados a este espaço no inventário central.
          </CardDescription>
        </div>
        <Button size="sm" onClick={onAdd} disabled={!hasZones}>
          <Plus />
          Adicionar sensor
        </Button>
      </CardHeader>
      <CardContent>
        {sensors.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <Broadcast className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium">Sem sensores neste espaço</p>
            <p className="max-w-sm text-xs text-muted-foreground">
              Adicione sensores com o botão acima. É necessário pelo menos uma
              zona na aba “Zonas”.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">ID</th>
                  <th className="px-3 py-2 font-medium">Zona</th>
                  <th className="px-3 py-2 font-medium">Tipo</th>
                  <th className="px-3 py-2 font-medium">Última leitura</th>
                  <th className="px-3 py-2 text-right font-medium">Bateria</th>
                  <th className="px-3 py-2 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {sensors.map((sensor) => (
                  <tr key={sensor.id} className="border-b last:border-b-0">
                    <td className="px-3 py-2 font-mono text-xs">{sensor.id}</td>
                    <td className="px-3 py-2">{sensor.zone}</td>
                    <td className="px-3 py-2">{sensor.type}</td>
                    <td className="px-3 py-2 tabular-nums text-muted-foreground">
                      {sensor.lastReading}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {sensor.battery}%
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant={statusVariant(sensor.status)}>
                        {sensorStatusLabels[sensor.status]}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}