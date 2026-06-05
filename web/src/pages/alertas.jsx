'use client'

import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { SlidersHorizontal } from "@phosphor-icons/react"

import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
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
import { FiltersSheet } from "#/components/alertas/filters-sheet"
import { api } from "#/lib/api"

export function AlertasPage() {
  const { setTitle } = useOutletContext()
  const [alerts, setAlerts] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [severityFilter, setSeverityFilter] = useState("todas")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [refresh, setRefresh] = useState(0)
  const [acknowledgingId, setAcknowledgingId] = useState(null)

  useEffect(() => {
    setTitle("Gestão de alertas")
  }, [setTitle])

  useEffect(() => {
    api.get("/alerts", { params: { summary: true, limit: 1 } })
      .then((res) => setSummary(res.data?.summary ?? null))
      .catch(() => setSummary(null))
  }, [refresh])

  useEffect(() => {
    setPage(1)
  }, [severityFilter, statusFilter])

  useEffect(() => {
    const params = { page, limit: PER_PAGE }
    if (severityFilter !== "todas") params.severity = severityFilter
    if (statusFilter === "pending") params.unacknowledgedOnly = true
    if (statusFilter === "confirmed") params.acknowledgedOnly = true

    setLoading(true)
    api.get("/alerts", { params })
      .then((res) => {
        setAlerts(res.data?.data ?? [])
        setTotal(res.data?.meta?.total ?? 0)
        setTotalPages(Math.max(1, res.data?.meta?.totalPages ?? 1))
      })
      .catch(() => {
        setAlerts([])
        setTotal(0)
        setTotalPages(1)
      })
      .finally(() => setLoading(false))
  }, [page, severityFilter, statusFilter, refresh])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const activeFilterCount = [
    severityFilter !== "todas",
    statusFilter !== "todos",
  ].filter(Boolean).length

  const currentPage = Math.min(page, totalPages)

  const handleAcknowledge = (alertId) => {
    setAcknowledgingId(alertId)
    api.patch(`/alerts/${alertId}`, { acknowledged: true })
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
              Filtre por severidade e confirme as ocorrências.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => setIsFilterOpen(true)}
          >
            <SlidersHorizontal />
            Filtros
            {activeFilterCount > 0 ? (
              <Badge variant="secondary">{activeFilterCount}</Badge>
            ) : null}
          </Button>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">A carregar...</p>
          ) : (
            <>
              <AlertsTable
                alerts={alerts}
                onAcknowledge={handleAcknowledge}
                acknowledgingId={acknowledgingId}
                filterActive={activeFilterCount > 0}
              />
              {total > 0 ? (
                <>
                  <div className="border-t" />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                      {total} {total === 1 ? "alerta" : "alertas"} — página{" "}
                      {currentPage} de {totalPages}
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

      <FiltersSheet
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        severityFilter={severityFilter}
        onSeverityFilterChange={setSeverityFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
    </div>
  )
}
