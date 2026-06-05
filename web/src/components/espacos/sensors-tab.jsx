'use client'

import { useEffect, useState } from "react"
import { Broadcast, PencilSimple, Plus, Trash } from "@phosphor-icons/react"
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
import { sensorTypeLabels, parameterLabels } from "#/data/sensores"
import { AddSensorDialog } from "#/components/espacos/add-sensor-dialog"

function formatBadge(str) {
  if (!str) return "—"
  return str.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())
}

export function SensorsTab({ spaceId, spaceName }) {
  const [sensors, setSensors] = useState([])
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [editSensor, setEditSensor] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([
      api.get(`/spaces/${spaceId}/sensors`).then((r) => r.data?.data ?? []).catch(() => []),
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
    const res = await api.post(`/sensors`, payload)
    setSensors((prev) => [res.data?.data ?? res.data, ...prev])
    setAddOpen(false)
  }

  const handleEdit = async (payload) => {
    const res = await api.patch(`/sensors/${editSensor.id}`, payload)
    setSensors((prev) => prev.map((s) => (s.id === editSensor.id ? (res.data?.data ?? res.data) : s)))
    setEditSensor(null)
  }

  const handleRemove = async (sensorId) => {
    const prev = sensors
    setSensors((current) => current.filter((s) => s.id !== sensorId))
    try {
      await api.delete(`/sensors/${sensorId}`)
    } catch {
      setSensors(prev)
    }
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
            <div className="flex min-h-[160px] flex-col items-center justify-center gap-1 border border-dashed p-6 text-center">
              <Broadcast className="size-8 text-muted-foreground" />
              <p className="text-sm font-medium">Nenhum sensor encontrado</p>
              <p className="max-w-sm text-xs text-muted-foreground">
                Adicione sensores com o botão acima. É necessária pelo menos uma
                zona na aba "Zonas".
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">ID</th>
                    <th className="pb-2 pr-4 font-medium">Zona</th>
                    <th className="pb-2 pr-4 font-medium">Tipo</th>
                    <th className="pb-2 pr-4 font-medium">Parâmetro</th>
                    <th className="pb-2 pr-4 text-right font-medium">Min</th>
                    <th className="pb-2 pr-4 text-right font-medium">Max</th>
                    <th className="pb-2 pr-4 font-medium">Estado</th>
                    <th className="pb-2 text-right font-medium">
                      <span className="sr-only">Ação</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sensors.map((sensor) => (
                    <tr key={sensor.id} className="border-b border-border last:border-0">
                      <td className="py-2.5 pr-4 font-mono text-xs">{sensor.id.slice(0, 8)}</td>
                      <td className="py-2.5 pr-4">{sensor.zoneName ?? "—"}</td>
                      <td className="py-2.5 pr-4">
                        <Badge variant="outline">{sensorTypeLabels[sensor.type] ?? formatBadge(sensor.type)}</Badge>
                      </td>
                      <td className="py-2.5 pr-4">
                        <Badge variant="outline">{parameterLabels[sensor.parameter] ?? formatBadge(sensor.parameter)}</Badge>
                      </td>
                      <td className="py-2.5 pr-4 text-right tabular-nums">{sensor.minValue}</td>
                      <td className="py-2.5 pr-4 text-right tabular-nums">{sensor.maxValue}</td>
                      <td className="py-2.5 pr-4">
                        <Badge variant={sensor.isActive ? "secondary" : "destructive"}>
                          {sensor.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </td>
                      <td className="py-2.5 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Editar sensor ${sensor.id.slice(0, 8)}`}
                          onClick={() => setEditSensor(sensor)}
                        >
                          <PencilSimple />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Remover sensor ${sensor.id.slice(0, 8)}`}
                          onClick={() => handleRemove(sensor.id)}
                        >
                          <Trash />
                        </Button>
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

      <AddSensorDialog
        open={editSensor !== null}
        mode="edit"
        initial={editSensor}
        spaceName={spaceName}
        zones={zones}
        onClose={() => setEditSensor(null)}
        onSubmit={handleEdit}
      />
    </>
  )
}
