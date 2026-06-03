'use client'

import { useEffect, useState } from "react"
import { ShieldWarning } from "@phosphor-icons/react"
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

function severityVariant(severity) {
  if (severity === "critical") return "destructive"
  if (severity === "warning") return "outline"
  return "secondary"
}

const severityLabels = {
  low: "Baixo",
  normal: "Normal",
  warning: "Aviso",
  critical: "Crítico",
}

function formatDate(value) {
  if (!value) return "—"
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString("pt-PT")
}

export function IncidentsTab({ spaceId }) {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api.get(`/spaces/${spaceId}/incidents`)
      .then((res) => {
        if (!cancelled) setIncidents(Array.isArray(res.data) ? res.data : [])
      })
      .catch(() => {
        if (!cancelled) setIncidents([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [spaceId])

  const handleToggleNotified = async (incidentId, value) => {
    const prev = incidents
    setIncidents((current) =>
      current.map((i) => (i.id === incidentId ? { ...i, isNotified: value } : i))
    )
    try {
      await api.patch(`/spaces/${spaceId}/incidents/${incidentId}`, { is_notified: value })
    } catch {
      setIncidents(prev)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldWarning />
          Alertas e incidentes
        </CardTitle>
        <CardDescription>
          Alertas gerados pelos sensores deste espaço.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">A carregar…</p>
        ) : incidents.length === 0 ? (
          <div className="flex min-h-[160px] flex-col items-center justify-center gap-1 border border-dashed p-6 text-center">
            <p className="text-sm font-medium">Nenhum incidente encontrado</p>
            <p className="text-xs text-muted-foreground">
              Sem incidentes para este espaço.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Mensagem</th>
                  <th className="pb-2 pr-4 font-medium">Gravidade</th>
                  <th className="pb-2 pr-4 font-medium">Criado</th>
                  <th className="pb-2 font-medium">Notificado</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.id} className="border-b border-border last:border-0">
                    <td className="py-2.5 pr-4">{incident.message}</td>
                    <td className="py-2.5 pr-4">
                      <Badge variant={severityVariant(incident.severity)}>
                        {severityLabels[incident.severity] ?? incident.severity}
                      </Badge>
                    </td>
                    <td className="py-2.5 pr-4 tabular-nums text-muted-foreground">
                      {formatDate(incident.created)}
                    </td>
                    <td className="py-2.5">
                      <Button
                        size="sm"
                        variant={incident.isNotified ? "secondary" : "outline"}
                        onClick={() => handleToggleNotified(incident.id, !incident.isNotified)}
                      >
                        {incident.isNotified ? "Notificado" : "Marcar"}
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
  )
}
