'use client'

import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { MagnifyingGlass, Plus } from "@phosphor-icons/react"

import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { Input } from "#/components/ui/input"
import { KpiCards } from "#/components/espacos/kpi-cards"
import { SpacesTable } from "#/components/espacos/spaces-table"
import { SpacesPagination } from "#/components/espacos/spaces-pagination"
import { SpaceFormDialog } from "#/components/espacos/space-form-dialog"
import { PER_PAGE } from "#/components/ui/pagination"
import { api } from "#/lib/api"

export function EspacosPage() {
  const { setTitle } = useOutletContext()
  const [spaces, setSpaces] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: PER_PAGE,
    total: 0,
    totalPages: 1,
  })
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)
  const [summary, setSummary] = useState(null)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    setTitle("Espaços verdes")
  }, [setTitle])

  useEffect(() => {
    setLoading(true)
    const params = {
      page,
      perPage: PER_PAGE,
      summary: true,
      ...(query && { query }),
    }
    api.get("/spaces", { params })
      .then((res) => {
        setSpaces(res.data.spaces)
        setPagination(res.data.pagination)
        setSummary(res.data.summary ?? null)
      })
      .catch(() => {
        setSpaces([])
        setPagination({ page: 1, perPage: PER_PAGE, total: 0, totalPages: 1 })
        setSummary(null)
      })
      .finally(() => setLoading(false))
  }, [page, query, refresh])

  useEffect(() => {
    setPage(1)
  }, [query])

  const handleCreate = ({ image, ...values }) => {
    const data = new FormData()
    Object.entries(values).forEach(([key, value]) => data.append(key, value))
    if (image) data.append("image", image)

    api.post("/spaces", data)
      .then(() => {
        setRefresh((n) => n + 1)
        setPage(1)
        setCreateOpen(false)
      })
      .catch(() => {})
  }

  return (
    <div className="flex flex-col gap-6">
      <KpiCards summary={summary} />

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Espaços</CardTitle>
            <CardDescription>
              Pesquise e filtre os espaços registados.
            </CardDescription>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative max-w-full sm:max-w-72">
              <MagnifyingGlass className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                aria-label="Pesquisar espaços"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Pesquisar por nome, freguesia ou código postal"
              />
            </div>
            <Button
              size="sm"
              className="shrink-0"
              onClick={() => setCreateOpen(true)}
            >
              <Plus />
              Novo espaço
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">A carregar...</p>
          ) : (
            <>
              <SpacesTable spaces={spaces} />
              {pagination.total > 0 ? (
                <>
                  <div className="border-t" />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                      {pagination.total} espaço(s) — página{" "}
                      {pagination.page} de {pagination.totalPages}
                    </p>
                    <SpacesPagination
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
