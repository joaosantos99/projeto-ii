'use client'

import { useEffect, useMemo, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { Plus } from "@phosphor-icons/react"

import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { KpiCards } from "#/components/espacos/kpi-cards"
import { FiltersBar } from "#/components/espacos/filters-bar"
import { SpacesTable } from "#/components/espacos/spaces-table"
import { SpacesPagination } from "#/components/espacos/spaces-pagination"
import { SpaceFormDialog } from "#/components/espacos/space-form-dialog"
import {
  ROWS_PER_PAGE,
  paginateSpaces,
  slugFromName,
  spacesSeed,
} from "#/data/espacos"

export function EspacosPage() {
  const { setTitle } = useOutletContext()
  const [spaces, setSpaces] = useState(spacesSeed)
  const [query, setQuery] = useState("")
  const [districtFilter, setDistrictFilter] = useState("todos")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    setTitle("Espaços verdes")
  }, [setTitle])

  useEffect(() => {
    setPage(1)
  }, [query, districtFilter, statusFilter])

  const districtOptions = useMemo(
    () => Array.from(new Set(spaces.map((s) => s.district))).sort(),
    [spaces]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return spaces.filter((space) => {
      const matchesQuery =
        !q ||
        space.name.toLowerCase().includes(q) ||
        space.municipality.toLowerCase().includes(q) ||
        space.district.toLowerCase().includes(q)
      const matchesDistrict =
        districtFilter === "todos" || space.district === districtFilter
      const matchesStatus =
        statusFilter === "todos" || space.operationalStatus === statusFilter
      return matchesQuery && matchesDistrict && matchesStatus
    })
  }, [spaces, query, districtFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = paginateSpaces(filtered, currentPage)

  const handleCreate = (values) => {
    let id = slugFromName(values.name)
    if (spaces.some((s) => s.id === id)) id = `${id}-${Date.now()}`
    setSpaces((prev) => [
      ...prev,
      {
        id,
        ...values,
        zonesCount: 0,
        sensorsCount: 1,
        activeAlerts: 0,
        operationalStatus: "ativo",
      },
    ])
    setCreateOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <KpiCards spaces={spaces} districtCount={districtOptions.length} />

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Espaços</CardTitle>
            <CardDescription>
              Pesquise e filtre os espaços registados.
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus />
            Novo espaço
          </Button>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <FiltersBar
            query={query}
            onQueryChange={setQuery}
            districtFilter={districtFilter}
            onDistrictFilterChange={setDistrictFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            districtOptions={districtOptions}
          />
          <div className="border-t" />
          <SpacesTable spaces={pageRows} />
          {filtered.length > 0 ? (
            <>
              <div className="border-t" />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  {filtered.length} de {spaces.length} espaço(s) — página{" "}
                  {currentPage} de {totalPages}
                </p>
                <SpacesPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      <SpaceFormDialog
        open={createOpen}
        mode="create"
        initial={null}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  )
}