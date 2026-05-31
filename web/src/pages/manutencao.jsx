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
import { KpiCards } from "#/components/manutencao/kpi-cards"
import { FiltersBar } from "#/components/manutencao/filters-bar"
import { Board } from "#/components/manutencao/board"
import { CreateTaskDialog } from "#/components/manutencao/create-task-dialog"
import { api } from "#/lib/api"

const STATUS_TO_COLUMN = {
  pending: "pendente",
  in_progress: "em_execucao",
  completed: "concluida",
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

export function ManutencaoPage() {
  const { setTitle } = useOutletContext()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [zoneFilter, setZoneFilter] = useState("todos")
  const [priorityFilter, setPriorityFilter] = useState("todos")

  useEffect(() => {
    setTitle("Gestão de manutenção")
  }, [setTitle])

  useEffect(() => {
    setLoading(true)
    api.get("/maintenance", { params: { limit: 1000 } })
      .then((res) => {
        const rows = res.data?.data ?? []
        setTasks(rows.map(normalizeTask).filter(Boolean))
      })
      .catch(() => setTasks([]))
      .finally(() => setLoading(false))
  }, [])

  const zones = useMemo(
    () => Array.from(new Set(tasks.map((task) => task.zone))).sort(),
    [tasks]
  )

  const filteredTasks = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim()
    return tasks.filter((task) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        task.title.toLowerCase().includes(normalizedQuery) ||
        task.id.toLowerCase().includes(normalizedQuery) ||
        task.technician.toLowerCase().includes(normalizedQuery)
      const matchesZone = zoneFilter === "todos" || task.zone === zoneFilter
      const matchesPriority =
        priorityFilter === "todos" || task.priority === priorityFilter
      return matchesQuery && matchesZone && matchesPriority
    })
  }, [tasks, query, zoneFilter, priorityFilter])

  const handleCreate = (payload) => {
    return api.post("/maintenance", payload).then((res) => {
      const created = normalizeTask(res.data?.data ?? res.data)
      if (created) setTasks((current) => [created, ...current])
      setCreateOpen(false)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <KpiCards tasks={tasks} />

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Painel de manutenção</CardTitle>
            <CardDescription>
              Filtre tarefas e acompanhe a fila por estado no kanban.
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus />
            Criar tarefa
          </Button>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <FiltersBar
            query={query}
            onQueryChange={setQuery}
            zoneFilter={zoneFilter}
            onZoneFilterChange={setZoneFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            zones={zones}
          />
          <div className="border-t" />
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">A carregar…</p>
          ) : (
            <Board tasks={filteredTasks} />
          )}
        </CardContent>
      </Card>

      <CreateTaskDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  )
}