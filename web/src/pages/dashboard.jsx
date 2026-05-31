'use client'

import { useEffect, useState, useMemo } from "react"
import { useOutletContext } from "react-router-dom"
import {
  Alarm,
  Broadcast,
  CheckCircle,
  Gauge,
  Heartbeat,
  Lightning,
  Warning,
  WarningCircle,
} from "@phosphor-icons/react"
import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import { KpiCard, KpiCardGrid } from "#/components/ui/kpi-card"
import { Widget, WidgetTile } from "#/components/ui/widget"
import { cn } from "#/lib/utils"
import { api } from "#/lib/api"
import { formatDateTime, relativeAge } from "#/lib/format-date"

const PAGE_SIZE = 4

const SEVERITY_RANK = { critical: 3, warning: 2, normal: 1 }

export function DashboardPage() {
  const { setTitle } = useOutletContext()

  const [summary, setSummary] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [spaces, setSpaces] = useState([])
  const [incidents, setIncidents] = useState([])
  const [page, setPage] = useState(1)
  const [acknowledgingId, setAcknowledgingId] = useState(null)

  useEffect(() => {
    setTitle("Visão geral")
  }, [setTitle])

  useEffect(() => {
    api.get("/dashboard/summary")
      .then((res) => setSummary(res.data?.data ?? res.data))
      .catch(() => setSummary(null))

    api.get("/alerts")
      .then((res) => setAlerts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setAlerts([]))

    api.get("/dashboard/irrigation-lighting")
      .then((res) => setSpaces(res.data?.data ?? []))
      .catch(() => setSpaces([]))

    api.get("/dashboard/citizen-incidents", { params: { limit: 3 } })
      .then((res) => setIncidents(res.data?.data ?? []))
      .catch(() => setIncidents([]))
  }, [])

  const spaceNameById = useMemo(() => {
    const map = new Map()
    for (const s of spaces) map.set(s.greenSpaceId, s.name)
    return map
  }, [spaces])

  const kpis = useMemo(() => [
    { label: "Alertas criticos", value: String(summary?.totalAlerts ?? 0), hint: "Total de alertas registados", Icon: Warning },
    { label: "Manutencao em atraso", value: String(summary?.totalLateMaintenance ?? 0), hint: "Prioridade de despacho", Icon: WarningCircle },
    { label: "Sensores offline", value: String(summary?.totalOfflineSensors ?? 0), hint: "Intervencao recomendada", Icon: Broadcast },
    { label: "Tempo medio de resposta", value: `${summary?.averageResponseTime ?? 0} min`, hint: "Media de confirmacao", Icon: Gauge },
  ], [summary])

  const sortedAlerts = useMemo(() => {
    return [...alerts].sort(
      (a, b) => (SEVERITY_RANK[b.severity] ?? 0) - (SEVERITY_RANK[a.severity] ?? 0),
    )
  }, [alerts])

  const totalPages = Math.max(1, Math.ceil(sortedAlerts.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedAlerts = sortedAlerts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleAcknowledge = (alertId) => {
    setAcknowledgingId(alertId)
    api.patch(`/alerts/${alertId}/acknowledge`)
      .then((res) => {
        setAlerts((current) =>
          current.map((item) =>
            item.id === alertId
              ? {
                  ...item,
                  status: res.data?.status ?? "confirmed",
                  isNotified: true,
                  updatedAt: res.data?.updatedAt ?? item.updatedAt,
                  updatedBy: res.data?.updatedBy ?? item.updatedBy,
                }
              : item,
          ),
        )
      })
      .catch(() => {})
      .finally(() => setAcknowledgingId(null))
  }

  return (
    <div className="flex flex-col gap-4">
      <KpiCardGrid>
        {kpis.map(({ label, value, hint, Icon }) => (
          <KpiCard
            key={label}
            label={label}
            value={value}
            hint={hint}
            icon={<Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />}
          />
        ))}
      </KpiCardGrid>

      <Widget
        title="Alertas ativos"
        description="Lista priorizada por severidade com acao imediata"
        action={
          <Button variant="outline" size="sm">
            <Alarm className="size-3.5" />
            Ver todos
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Regra</th>
                <th className="pb-2 pr-4 font-medium">Espaco</th>
                <th className="pb-2 pr-4 font-medium">Severidade</th>
                <th className="pb-2 pr-4 font-medium">Data</th>
                <th className="pb-2 text-right font-medium">Acao</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAlerts.map((alert) => {
                const acknowledged = alert.status === "confirmed" || alert.isNotified
                const isBusy = acknowledgingId === alert.id
                return (
                  <tr key={alert.id} className="border-b border-border last:border-0">
                    <td className="py-2.5 pr-4">{alert.message}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">
                      {spaceNameById.get(alert.greenSpaceId) ?? "—"}
                    </td>
                    <td className="py-2.5 pr-4">
                      <Badge variant={alert.severity === "critical" ? "destructive" : "warning"}>
                        {alert.severity === "critical" ? "Critico" : "Warning"}
                      </Badge>
                    </td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{formatDateTime(alert.createdAt)}</td>
                    <td className="py-2.5 text-right">
                      <Button
                        size="xs"
                        variant={acknowledged ? "secondary" : "outline"}
                        disabled={acknowledged || isBusy}
                        onClick={() => handleAcknowledge(alert.id)}
                        className={acknowledged ? "bg-green-50 text-green-700 ring-1 ring-green-200 hover:bg-green-100" : ""}
                      >
                        {acknowledged ? (
                          <>
                            <CheckCircle className="size-3" />
                            Confirmado
                          </>
                        ) : (
                          <>
                            <Alarm className="size-3" />
                            {isBusy ? "A confirmar..." : "Confirmar"}
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            {sortedAlerts.length} alerta(s) encontrados - pagina {currentPage} de {totalPages}
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
      </Widget>

      <section className="grid gap-4 xl:grid-cols-2">
        <Widget
          title="Estado de rega e iluminacao"
          description="Indicadores por espaco"
        >
          <div className="grid grid-cols-2 gap-2">
            {spaces.map((space) => {
              const irrigation = space.irrigationStatus === "ON"
              const lighting = space.lightingStatus === "ON"
              return (
                <WidgetTile key={space.greenSpaceId}>
                  <p className="text-xs font-medium">{space.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant={irrigation ? "secondary" : "outline"}>
                      <Heartbeat className="size-3" />
                      Rega {irrigation ? "ON" : "OFF"}
                    </Badge>
                    <Badge variant={lighting ? "secondary" : "outline"}>
                      <Lightning className="size-3" />
                      Luz {lighting ? "ON" : "OFF"}
                    </Badge>
                  </div>
                </WidgetTile>
              )
            })}
          </div>
        </Widget>

        <Widget
          title="Incidentes de cidadaos por rever"
          description="Ocorrencias mais recentes sem validacao"
          contentClassName="flex flex-col gap-2"
        >
          {incidents.map((incident) => (
            <WidgetTile key={incident.id}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium">{incident.name ?? incident.id}</p>
                <Badge variant="outline">{relativeAge(incident.createdAt)}</Badge>
              </div>
              <p className="mt-1 text-xs">{incident.description}</p>
              <p className="text-xs text-muted-foreground">
                {spaceNameById.get(incident.greenSpaceId) ?? "—"}
              </p>
            </WidgetTile>
          ))}
          <Button size="sm" variant="default">
            Rever fila de incidentes
          </Button>
        </Widget>
      </section>
    </div>
  )
}
