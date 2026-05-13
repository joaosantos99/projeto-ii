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
import {
  USERS_PER_PAGE,
  paginateUsers,
  usersSeed,
} from "#/data/utilizadores"

export function UtilizadoresPage() {
  const { setTitle } = useOutletContext()
  const [users, setUsers] = useState(usersSeed)
  const [query, setQuery] = useState("")
  const [createUserOpen, setCreateUserOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [roleFilter, setRoleFilter] = useState("todos")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [page, setPage] = useState(1)

  useEffect(() => {
    setTitle("Gestão de utilizadores")
  }, [setTitle])

  const filteredUsers = useMemo(() => {
    const normalized = query.toLowerCase()
    return users.filter((user) => {
      const matchesQuery =
        user.name.toLowerCase().includes(normalized) ||
        user.email.toLowerCase().includes(normalized)
      const matchesRole = roleFilter === "todos" || user.role === roleFilter
      const matchesStatus = statusFilter === "todos" || user.status === statusFilter
      return matchesQuery && matchesRole && matchesStatus
    })
  }, [users, query, roleFilter, statusFilter])

  const activeFilterCount = [roleFilter, statusFilter].filter(
    (value) => value !== "todos"
  ).length

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const paginatedUsers = paginateUsers(filteredUsers, currentPage)

  useEffect(() => {
    setPage(1)
  }, [query, roleFilter, statusFilter])

  const handleCreate = ({ name, email, role, status }) => {
    setUsers((current) => [
      {
        id: `USR-${300 + current.length}`,
        name,
        email,
        role,
        status,
        lastAccess: "Nunca",
      },
      ...current,
    ])
    setPage(1)
    setCreateUserOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <KpiCards users={users} />

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
          {filteredUsers.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <UsersTable users={paginatedUsers} />
              <div className="border-t" />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  {filteredUsers.length} de {users.length} utilizador(es) — página{" "}
                  {currentPage} de {totalPages}
                </p>
                <UsersPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
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
      />

      <CreateUserDialog
        open={createUserOpen}
        onClose={() => setCreateUserOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  )
}
