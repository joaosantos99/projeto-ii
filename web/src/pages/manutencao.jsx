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
import { maintenanceTasksSeed } from "#/data/manutencao"

export function ManutencaoPage() {
  const { setTitle } = useOutletContext()
  const [tasks, setTasks] = useState(maintenanceTasksSeed)
  const [createOpen, setCreateOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [zoneFilter, setZoneFilter] = useState("todos")
  const [priorityFilter, setPriorityFilter] = useState("todos")

  useEffect(() => {
    setTitle("Gestão de manutenção")
  }, [setTitle])

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

  const handleCreate = ({ title, zone, priority }) => {
    setTasks((current) => [
      {
        id: `MT-${1200 + current.length + 10}`,
        title,
        zone,
        technician: "Por atribuir",
        priority,
        dueDate: "2026-03-26",
        status: "pendente",
      },
      ...current,
    ])
    setCreateOpen(false)
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
          <Board tasks={filteredTasks} />
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