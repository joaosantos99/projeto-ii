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
          <div className="py-8 text-center text-sm text-muted-foreground">
            Sem incidentes para este espaço.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">ID</th>
                  <th className="px-3 py-2 font-medium">Mensagem</th>
                  <th className="px-3 py-2 font-medium">Gravidade</th>
                  <th className="px-3 py-2 font-medium">Criado</th>
                  <th className="px-3 py-2 font-medium">Notificado</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.id} className="border-b last:border-b-0">
                    <td className="px-3 py-2 font-mono text-xs">{incident.id.slice(0, 8)}</td>
                    <td className="px-3 py-2">{incident.message}</td>
                    <td className="px-3 py-2">
                      <Badge variant={severityVariant(incident.severity)}>
                        {severityLabels[incident.severity] ?? incident.severity}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 tabular-nums text-muted-foreground">
                      {formatDate(incident.created)}
                    </td>
                    <td className="px-3 py-2">
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
