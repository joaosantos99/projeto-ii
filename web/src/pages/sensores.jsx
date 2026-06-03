'use client'

import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { MagnifyingGlass, SlidersHorizontal } from "@phosphor-icons/react"

import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { Input } from "#/components/ui/input"
import { Pagination, PER_PAGE } from "#/components/ui/pagination"
import { SensorsKpiCards } from "#/components/sensores/kpi-cards"
import { SensorsDistributionChart } from "#/components/sensores/distribution-chart"
import { SensorsTable } from "#/components/sensores/sensors-table"
import { SensorsFiltersSheet } from "#/components/sensores/filters-sheet"
import { api } from "#/lib/api"

export function SensoresPage() {
  const { setTitle } = useOutletContext()
  const [sensors, setSensors] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PER_PAGE,
    total: 0,
    totalPages: 1,
  })
  const [summary, setSummary] = useState(null)
  const [distribution, setDistribution] = useState(null)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [typeFilter, setTypeFilter] = useState("todos")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setTitle("Inventário de sensores")
  }, [setTitle])

  useEffect(() => {
    setLoading(true)
    const params = {
      page,
      limit: PER_PAGE,
      summary: true,
      distribution: true,
      ...(query.trim() && { query: query.trim() }),
      ...(statusFilter !== "todos" && { status: statusFilter }),
      ...(typeFilter !== "todos" && { type: typeFilter }),
    }
    api.get("/sensors", { params })
      .then((res) => {
        setSensors(res.data?.data ?? [])
        setPagination(res.data?.meta ?? { page: 1, limit: PER_PAGE, total: 0, totalPages: 1 })
        setSummary(res.data?.summary ?? null)
        setDistribution(res.data?.distribution ?? null)
      })
      .catch(() => {
        setSensors([])
        setPagination({ page: 1, limit: PER_PAGE, total: 0, totalPages: 1 })
        setSummary(null)
        setDistribution(null)
      })
      .finally(() => setLoading(false))
  }, [page, query, statusFilter, typeFilter])

  useEffect(() => {
    setPage(1)
  }, [query, statusFilter, typeFilter])

  const activeFilterCount = [
    statusFilter !== "todos",
    typeFilter !== "todos",
  ].filter(Boolean).length

  return (
    <div className="flex flex-col gap-6">
      <SensorsKpiCards summary={summary} />

      <SensorsDistributionChart distribution={distribution} />

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Estado dos sensores</CardTitle>
            <CardDescription>
              Pesquise, filtre e reveja o estado operacional.
            </CardDescription>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative max-w-full sm:max-w-72">
              <MagnifyingGlass className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                aria-label="Pesquisar sensores"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Pesquisar por espaço, zona ou tipo"
              />
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
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">A carregar...</p>
          ) : (
            <>
              <SensorsTable
                sensors={sensors}
                filterActive={activeFilterCount > 0 || query.trim().length > 0}
              />
              {pagination.total > 0 ? (
                <>
                  <div className="border-t" />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                      {pagination.total}{" "}
                      {pagination.total === 1 ? "sensor" : "sensores"} — página{" "}
                      {pagination.page} de {pagination.totalPages}
                    </p>
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                </>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>

      <SensorsFiltersSheet
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />
    </div>
  )
}
