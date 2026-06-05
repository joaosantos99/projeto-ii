'use client'

import { useEffect, useMemo, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { MagnifyingGlass, Plus, SlidersHorizontal } from "@phosphor-icons/react"

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
import { KpiCards } from "#/components/manutencao/kpi-cards"
import { FiltersSheet } from "#/components/manutencao/filters-sheet"
import { Board } from "#/components/manutencao/board"
import { CreateTaskDialog } from "#/components/manutencao/create-task-dialog"
import { EditTaskDialog } from "#/components/manutencao/edit-task-dialog"
import { boardColumns } from "#/data/manutencao"
import { api } from "#/lib/api"

const PER_COLUMN = 5

const STATUS_TO_COLUMN = {
  pending: "pendente",
  in_progress: "em_execucao",
  completed: "concluida",
}

const COLUMN_TO_STATUS = {
  pendente: "pending",
  em_execucao: "in_progress",
  concluida: "completed",
}

function normalizeTask(task) {
  const column = STATUS_TO_COLUMN[task.status]
  if (!column) return null

  const dueDate = task.scheduledDate ? task.scheduledDate.slice(0, 10) : ""
  const overdue =
    !task.completedAt && dueDate !== "" && dueDate < new Date().toISOString().slice(0, 10)

  return {
    id: task.id,
    title: task.description ?? task.type,
    zone: task.type,
    technician: "—",
    priority: overdue && column !== "concluida" ? "critical" : "normal",
    dueDate,
    status: column,
  }
}

function emptyColumnState() {
  return Object.fromEntries(
    boardColumns.map((column) => [
      column.id,
      { tasks: [], total: 0, page: 0, loading: false },
    ]),
  )
}

export function ManutencaoPage() {
  const { setTitle } = useOutletContext()
  const [columnState, setColumnState] = useState(emptyColumnState)
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [zoneFilter, setZoneFilter] = useState("todos")
  const [priorityFilter, setPriorityFilter] = useState("todos")

  useEffect(() => {
    setTitle("Gestão de manutenção")
  }, [setTitle])

  const fetchColumnPage = (columnId, page) => {
    const status = COLUMN_TO_STATUS[columnId]
    if (!status) return Promise.resolve()

    setColumnState((current) => ({
      ...current,
      [columnId]: { ...current[columnId], loading: true },
    }))

    return api
      .get("/maintenance", { params: { status, page, limit: PER_COLUMN } })
      .then((res) => {
        const rows = (res.data?.data ?? []).map(normalizeTask).filter(Boolean)
        const total = res.data?.meta?.total ?? 0
        setColumnState((current) => ({
          ...current,
          [columnId]: {
            tasks: page === 1 ? rows : [...current[columnId].tasks, ...rows],
            total,
            page,
            loading: false,
          },
        }))
      })
      .catch(() => {
        setColumnState((current) => ({
          ...current,
          [columnId]: { ...current[columnId], loading: false },
        }))
      })
  }

  useEffect(() => {
    setLoading(true)
    Promise.all(boardColumns.map((column) => fetchColumnPage(column.id, 1)))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLoadMore = (columnId) => {
    fetchColumnPage(columnId, columnState[columnId].page + 1)
  }

  const allTasks = useMemo(
    () => boardColumns.flatMap((column) => columnState[column.id].tasks),
    [columnState],
  )

  const zones = useMemo(
    () => Array.from(new Set(allTasks.map((task) => task.zone))).sort(),
    [allTasks],
  )

  const activeFilterCount = [zoneFilter, priorityFilter].filter(
    (value) => value !== "todos",
  ).length

  const matchesFilters = (task) => {
    const normalizedQuery = query.toLowerCase().trim()
    const matchesQuery =
      normalizedQuery.length === 0 ||
      task.title.toLowerCase().includes(normalizedQuery) ||
      task.id.toLowerCase().includes(normalizedQuery) ||
      task.technician.toLowerCase().includes(normalizedQuery)
    const matchesZone = zoneFilter === "todos" || task.zone === zoneFilter
    const matchesPriority =
      priorityFilter === "todos" || task.priority === priorityFilter
    return matchesQuery && matchesZone && matchesPriority
  }

  const columns = useMemo(
    () =>
      boardColumns.map((column) => {
        const state = columnState[column.id]
        return {
          ...column,
          tasks: state.tasks.filter(matchesFilters),
          total: state.total,
          loadedCount: state.tasks.length,
          loading: state.loading,
          hasMore: state.tasks.length < state.total,
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnState, query, zoneFilter, priorityFilter],
  )

  const handleMoveTask = (taskId, columnId) => {
    const status = COLUMN_TO_STATUS[columnId]
    if (!status) return

    let snapshot
    setColumnState((current) => {
      snapshot = current
      const next = { ...current }
      let moved

      for (const id of Object.keys(next)) {
        const index = next[id].tasks.findIndex((task) => task.id === taskId)
        if (index >= 0) {
          moved = { ...next[id].tasks[index], status: columnId }
          next[id] = {
            ...next[id],
            tasks: next[id].tasks.filter((task) => task.id !== taskId),
            total: Math.max(0, next[id].total - 1),
          }
        }
      }

      if (!moved) return current

      next[columnId] = {
        ...next[columnId],
        tasks: [moved, ...next[columnId].tasks],
        total: next[columnId].total + 1,
      }
      return next
    })

    api.patch(`/maintenance/${taskId}/status`, { status }).catch(() => {
      setColumnState(snapshot)
    })
  }

  const handleCreate = (payload) => {
    return api.post("/maintenance", payload).then((res) => {
      const created = normalizeTask(res.data?.data ?? res.data)
      if (created) {
        setColumnState((current) => ({
          ...current,
          [created.status]: {
            ...current[created.status],
            tasks: [created, ...current[created.status].tasks],
            total: current[created.status].total + 1,
          },
        }))
      }
      setCreateOpen(false)
    })
  }

  const handleUpdate = (payload) => {
    return api.put(`/maintenance/${editTask.id}`, payload).then((res) => {
      const updated = normalizeTask(res.data?.data ?? res.data)
      if (updated) {
        setColumnState((current) => {
          const next = { ...current }
          for (const id of Object.keys(next)) {
            const idx = next[id].tasks.findIndex((t) => t.id === editTask.id)
            if (idx >= 0) {
              const tasks = [...next[id].tasks]
              tasks[idx] = updated
              next[id] = { ...next[id], tasks }
            }
          }
          return next
        })
      }
      setEditTask(null)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <KpiCards tasks={allTasks} />

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Painel de manutenção</CardTitle>
            <CardDescription>
              Filtre tarefas e acompanhe a fila por estado no kanban.
            </CardDescription>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative max-w-full sm:max-w-72">
              <MagnifyingGlass className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                aria-label="Pesquisar tarefas"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Pesquisar por título, ID ou técnico"
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
            <Button size="sm" className="shrink-0" onClick={() => setCreateOpen(true)}>
              <Plus />
              Criar tarefa
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">A carregar…</p>
          ) : (
            <Board
              columns={columns}
              onMoveTask={handleMoveTask}
              onLoadMore={handleLoadMore}
              onEditTask={setEditTask}
            />
          )}
        </CardContent>
      </Card>

      <CreateTaskDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />

      <EditTaskDialog
        open={editTask !== null}
        task={editTask}
        onClose={() => setEditTask(null)}
        onSubmit={handleUpdate}
      />

      <FiltersSheet
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        zoneFilter={zoneFilter}
        onZoneFilterChange={setZoneFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        zones={zones}
      />
    </div>
  )
}
