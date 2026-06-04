'use client'

import { useEffect, useMemo, useState } from "react"
import { useOutletContext } from "react-router-dom"
import {
  MagnifyingGlass,
  SlidersHorizontal,
  UserPlus,
} from "@phosphor-icons/react"

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
import { KpiCards } from "#/components/utilizadores/kpi-cards"
import { UsersTable } from "#/components/utilizadores/users-table"
import { UsersPagination } from "#/components/utilizadores/users-pagination"
import { EmptyState } from "#/components/utilizadores/empty-state"
import { FiltersSheet } from "#/components/utilizadores/filters-sheet"
import { CreateUserDialog } from "#/components/utilizadores/create-user-dialog"
import { PER_PAGE } from "#/components/ui/pagination"
import { api } from "#/lib/api"

export function UtilizadoresPage() {
  const { setTitle } = useOutletContext()
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: PER_PAGE,
    total: 0,
    totalPages: 1,
  })
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [createUserOpen, setCreateUserOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [roleFilter, setRoleFilter] = useState("todos")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [page, setPage] = useState(1)
  const [summary, setSummary] = useState(null)
  const [refresh, setRefresh] = useState(0)
  const [roles, setRoles] = useState([])

  useEffect(() => {
    setTitle("Gestão de utilizadores")
  }, [setTitle])

  useEffect(() => {
    api.get("/roles")
      .then((res) => setRoles(res.data))
      .catch(() => setRoles([]))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {
      page,
      perPage: PER_PAGE,
      summary: true,
      ...(query && { query }),
      ...(roleFilter !== "todos" && { role: roleFilter }),
      ...(statusFilter !== "todos" && { status: statusFilter }),
    }
    api.get("/users", { params })
      .then((res) => {
        setUsers(res.data.users)
        setPagination(res.data.pagination)
        setSummary(res.data.summary ?? null)
      })
      .catch(() => {
        setUsers([])
        setPagination({ page: 1, perPage: PER_PAGE, total: 0, totalPages: 1 })
        setSummary(null)
      })
      .finally(() => setLoading(false))
  }, [page, query, roleFilter, statusFilter, refresh])

  useEffect(() => {
    setPage(1)
  }, [query, roleFilter, statusFilter])

  const roleOptions = useMemo(() => {
    return roles.map((r) => ({
      value: r.name,
      label: r.name.charAt(0).toUpperCase() + r.name.slice(1),
    }))
  }, [roles])

  const activeFilterCount = [roleFilter, statusFilter].filter(
    (value) => value !== "todos"
  ).length

  const handleCreate = (payload) => {
    return api.post("/users", payload).then(() => {
      setRefresh((n) => n + 1)
      setPage(1)
      setCreateUserOpen(false)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <KpiCards summary={summary} />

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Lista de utilizadores</CardTitle>
            <CardDescription>
              Filtre por perfil e estado, depois faça a gestão de acessos.
            </CardDescription>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative max-w-full sm:max-w-72">
              <MagnifyingGlass className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                aria-label="Pesquisar utilizadores"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Pesquisar por nome ou email"
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
            <Button
              size="sm"
              className="shrink-0"
              onClick={() => setCreateUserOpen(true)}
            >
              <UserPlus />
              Novo utilizador
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">A carregar...</p>
          ) : users.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <UsersTable users={users} roleOptions={roleOptions} />
              <div className="border-t" />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  {pagination.total} utilizador(es) — página{" "}
                  {pagination.page} de {pagination.totalPages}
                </p>
                <UsersPagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <FiltersSheet
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        roleOptions={roleOptions}
      />

      <CreateUserDialog
        open={createUserOpen}
        onClose={() => setCreateUserOpen(false)}
        onCreate={handleCreate}
        roleOptions={roleOptions}
      />
    </div>
  )
}
