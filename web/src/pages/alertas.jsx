'use client'

import { useEffect, useMemo, useState } from "react"
import { useOutletContext } from "react-router-dom"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { Pagination, PER_PAGE } from "#/components/ui/pagination"
import { AlertsKpiCards } from "#/components/alertas/kpi-cards"
import { AlertsTable } from "#/components/alertas/alerts-table"
import { selectClass } from "#/data/manutencao"
import { api } from "#/lib/api"

const severityOptions = [
  { value: "todas", label: "Todas as severidades" },
  { value: "critical", label: "Crítico" },
  { value: "warning", label: "Aviso" },
  { value: "normal", label: "Normal" },
]

export function AlertasPage() {
  const { setTitle } = useOutletContext()
  const [alerts, setAlerts] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [severityFilter, setSeverityFilter] = useState("todas")
  const [page, setPage] = useState(1)
  const [refresh, setRefresh] = useState(0)
  const [acknowledgingId, setAcknowledgingId] = useState(null)

  useEffect(() => {
    setTitle("Gestão de alertas")
  }, [setTitle])

  useEffect(() => {
    api.get("/alerts/summary")
      .then((res) => setSummary(res.data?.data ?? res.data))
      .catch(() => setSummary(null))
  }, [refresh])

  useEffect(() => {
    setLoading(true)
    api.get("/alerts")
      .then((res) => setAlerts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false))
  }, [refresh])

  useEffect(() => {
    setPage(1)
  }, [severityFilter])

  const filtered = useMemo(() => {
    if (severityFilter === "todas") return alerts
    return alerts.filter((a) => a.severity === severityFilter)
  }, [alerts, severityFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  )

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
        setRefresh((n) => n + 1)
      })
      .catch(() => {})
      .finally(() => setAcknowledgingId(null))
  }

  return (
    <div className="flex flex-col gap-6">
      <AlertsKpiCards summary={summary} />

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Alertas disparados</CardTitle>
            <CardDescription>
              Filtre por severidade e reconheça ocorrências para a equipa.
            </CardDescription>
          </div>
          <div className="w-full sm:w-56">
            <select
              aria-label="Filtrar por severidade"
              className={selectClass}
              value={severityFilter}
              onChange={(event) => setSeverityFilter(event.target.value)}
            >
              {severityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">A carregar...</p>
          ) : (
            <>
              <AlertsTable
                alerts={paginated}
                onAcknowledge={handleAcknowledge}
                acknowledgingId={acknowledgingId}
              />
              {filtered.length > 0 ? (
                <>
                  <div className="border-t" />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                      {filtered.length} alerta(s) — página {currentPage} de{" "}
                      {totalPages}
                    </p>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                </>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
