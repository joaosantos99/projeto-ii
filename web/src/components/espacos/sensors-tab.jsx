'use client'

import { useEffect, useState } from "react"
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
import { api } from "#/lib/api"
import { AddSensorDialog } from "#/components/espacos/add-sensor-dialog"

export function SensorsTab({ spaceId, spaceName }) {
  const [sensors, setSensors] = useState([])
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([
      api.get(`/spaces/${spaceId}/sensors`).then((r) => r.data).catch(() => []),
      api.get(`/spaces/${spaceId}/zones`).then((r) => r.data).catch(() => []),
    ])
      .then(([s, z]) => {
        if (cancelled) return
        setSensors(Array.isArray(s) ? s : [])
        setZones(Array.isArray(z) ? z : [])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [spaceId])

  const handleAdd = async (payload) => {
    const res = await api.post(`/spaces/${spaceId}/sensors`, payload)
    setSensors((prev) => [res.data, ...prev])
    setAddOpen(false)
  }

  return (
    <>
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
          <Button size="sm" onClick={() => setAddOpen(true)} disabled={zones.length === 0}>
            <Plus />
            Adicionar sensor
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-6 text-center text-sm text-muted-foreground">A carregar…</p>
          ) : sensors.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Broadcast className="size-8 text-muted-foreground" />
              <p className="text-sm font-medium">Sem sensores neste espaço</p>
              <p className="max-w-sm text-xs text-muted-foreground">
                Adicione sensores com o botão acima. É necessária pelo menos uma
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
                    <th className="px-3 py-2 font-medium">Parâmetro</th>
                    <th className="px-3 py-2 text-right font-medium">Min</th>
                    <th className="px-3 py-2 text-right font-medium">Max</th>
                    <th className="px-3 py-2 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {sensors.map((sensor) => (
                    <tr key={sensor.id} className="border-b last:border-b-0">
                      <td className="px-3 py-2 font-mono text-xs">{sensor.id.slice(0, 8)}</td>
                      <td className="px-3 py-2">{sensor.zoneName ?? "—"}</td>
                      <td className="px-3 py-2">{sensor.type}</td>
                      <td className="px-3 py-2">{sensor.parameter}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{sensor.minValue}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{sensor.maxValue}</td>
                      <td className="px-3 py-2">
                        <Badge variant={sensor.isActive ? "secondary" : "destructive"}>
                          {sensor.isActive ? "Ativo" : "Inativo"}
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

      <AddSensorDialog
        open={addOpen}
        spaceName={spaceName}
        zones={zones}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
      />
    </>
  )
}
