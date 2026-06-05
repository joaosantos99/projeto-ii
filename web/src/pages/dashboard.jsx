'use client'

import { useEffect, useState, useMemo } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import {
  Alarm,
  Broadcast,
  CheckCircle,
  Drop,
  Gauge,
  Lightning,
  SpeakerHigh,
  Thermometer,
  Warning,
  WarningCircle,
} from "@phosphor-icons/react"
import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import { KpiCard, KpiCardGrid } from "#/components/ui/kpi-card"
import { Widget, WidgetTile } from "#/components/ui/widget"
import { Pagination } from "#/components/ui/pagination"
import { api } from "#/lib/api"
import { formatDateTime, relativeAge } from "#/lib/format-date"

const PAGE_SIZE = 10

const SEVERITY_RANK = { critical: 3, warning: 2, normal: 1 }

const SENSOR_TYPE_META = [
  { type: "temperature", label: "Temp", Icon: Thermometer },
  { type: "humidity", label: "Humidade", Icon: Drop },
  { type: "light", label: "Luz", Icon: Lightning },
  { type: "sound", label: "Som", Icon: SpeakerHigh },
]

export function DashboardPage() {
  const { setTitle } = useOutletContext()
  const navigate = useNavigate()

  const [alerts, setAlerts] = useState([])
  const [alertsTotal, setAlertsTotal] = useState(0)
  const [alertsTotalPages, setAlertsTotalPages] = useState(1)
  const [allAlertsTotal, setAllAlertsTotal] = useState(0)
  const [spaces, setSpaces] = useState([])
  const [incidents, setIncidents] = useState([])
  const [offlineSensors, setOfflineSensors] = useState(0)
  const [lateMaintenance, setLateMaintenance] = useState(0)
  const [averageResponseTime, setAverageResponseTime] = useState(0)
  const [page, setPage] = useState(1)
  const [refresh, setRefresh] = useState(0)
  const [acknowledgingId, setAcknowledgingId] = useState(null)

  useEffect(() => {
    setTitle("Visão geral")
  }, [setTitle])

  useEffect(() => {
    api.get("/sensors", { params: { offlineOnly: true, limit: 1 } })
      .then((res) => setOfflineSensors(res.data?.meta?.total ?? 0))
      .catch(() => setOfflineSensors(0))

    api.get("/alerts", { params: { onlyCount: true } })
      .then((res) => setAllAlertsTotal(res.data?.meta?.total ?? 0))
      .catch(() => setAllAlertsTotal(0))

    api.get("/maintenance", { params: { status: "atraso", limit: 1 } })
      .then((res) => setLateMaintenance(res.data?.meta?.total ?? 0))
      .catch(() => setLateMaintenance(0))

    api.get("/maintenance", { params: { includeAverageResponseTime: true, limit: 1 } })
      .then((res) => setAverageResponseTime(res.data?.meta?.averageResponseTime ?? 0))
      .catch(() => setAverageResponseTime(0))

    api.get("/spaces", { params: { sensoresStatus: true, perPage: 6 } })
      .then((res) => setSpaces(res.data?.spaces ?? []))
      .catch(() => setSpaces([]))

    api.get("/reports", { params: { type: "incident", status: "open", limit: 3 } })
      .then((res) => setIncidents(res.data?.data ?? []))
      .catch(() => setIncidents([]))
  }, [refresh])

  useEffect(() => {
    api.get("/alerts", { params: { page, limit: PAGE_SIZE, unacknowledgedOnly: true } })
      .then((res) => {
        setAlerts(res.data?.data ?? [])
        setAlertsTotal(res.data?.meta?.total ?? 0)
        setAlertsTotalPages(res.data?.meta?.totalPages ?? 1)
      })
      .catch(() => {
        setAlerts([])
        setAlertsTotal(0)
        setAlertsTotalPages(1)
      })
  }, [page, refresh])

  const kpis = useMemo(() => [
    { label: "Alertas", value: String(allAlertsTotal), hint: "Total de alertas registados", Icon: Warning },
    { label: "Manutenção em atraso", value: String(lateMaintenance), hint: "Prioridade de despacho", Icon: WarningCircle },
    { label: "Sensores offline", value: String(offlineSensors), hint: "Intervenção recomendada", Icon: Broadcast },
    { label: "Tempo médio de resposta", value: `${averageResponseTime} min`, hint: "Média de confirmação", Icon: Gauge },
  ], [allAlertsTotal, lateMaintenance, offlineSensors, averageResponseTime])

  const paginatedAlerts = useMemo(() => {
    return [...alerts].sort(
      (a, b) => (SEVERITY_RANK[b.severity] ?? 0) - (SEVERITY_RANK[a.severity] ?? 0),
    )
  }, [alerts])

  const totalPages = Math.max(1, alertsTotalPages)
  const currentPage = Math.min(page, totalPages)

  const handleAcknowledge = (alertId) => {
    setAcknowledgingId(alertId)
    api.patch(`/alerts/${alertId}`, { acknowledged: true })
      .then(() => setRefresh((n) => n + 1))
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
        description="Lista priorizada por severidade com ação imediata"
        action={
          <Button variant="outline" size="sm" onClick={() => navigate("/admin/alertas")}>
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
                <th className="pb-2 pr-4 font-medium">Espaço</th>
                <th className="pb-2 pr-4 font-medium">Severidade</th>
                <th className="pb-2 pr-4 font-medium">Data</th>
                <th className="pb-2 text-right font-medium">Ação</th>
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
                      {alert.greenSpaceName ?? "—"}
                    </td>
                    <td className="py-2.5 pr-4">
                      <Badge variant={alert.severity === "critical" ? "destructive" : "warning"}>
                        {alert.severity === "critical" ? "Crítico" : "Aviso"}
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
        <div className="border-t" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            {alertsTotal} alerta(s) — página {currentPage} de {totalPages}
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </Widget>

      <section className="grid gap-4 xl:grid-cols-2">
        <Widget
          title="Estado de rega e iluminação"
          description="Indicadores por espaco"
        >
          <div className="grid grid-cols-2 gap-2">
            {spaces.map((space) => (
              <WidgetTile key={space.id}>
                <p className="text-xs font-medium">{space.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {SENSOR_TYPE_META.map(({ type, label, Icon }) => {
                    const on = space.sensoresStatus?.[type]?.isActive === true
                    return (
                      <Badge key={type} variant={on ? "secondary" : "outline"}>
                        <Icon className="size-3" />
                        {label} {on ? "ON" : "OFF"}
                      </Badge>
                    )
                  })}
                </div>
              </WidgetTile>
            ))}
          </div>
        </Widget>

        <Widget
          title="Incidentes de cidadãos por rever"
          description="Ocorrências mais recentes sem validação"
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
                {incident.scope ?? "—"}
              </p>
            </WidgetTile>
          ))}
          <Button size="sm" variant="default" onClick={() => navigate("/admin/alertas")}>
            Rever fila de incidentes
          </Button>
        </Widget>
      </section>
    </div>
  )
}
