'use client'

import { useEffect, useState } from "react"
import { Wrench } from "@phosphor-icons/react"
import { Badge } from "#/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { api } from "#/lib/api"

const statusLabels = {
  pending: "Pendente",
  in_progress: "Em execução",
  completed: "Concluída",
  pendente: "Pendente",
  em_execucao: "Em execução",
  concluida: "Concluída",
}

function statusVariant(status) {
  if (status === "completed" || status === "concluida") return "secondary"
  if (status === "in_progress" || status === "em_execucao") return "outline"
  return "destructive"
}

function formatDate(value) {
  if (!value) return "—"
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("pt-PT")
}

export function MaintenanceTab({ spaceId }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api.get(`/spaces/${spaceId}/maintenance`)
      .then((res) => {
        if (!cancelled) setTasks(Array.isArray(res.data) ? res.data : [])
      })
      .catch(() => {
        if (!cancelled) setTasks([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [spaceId])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Wrench />
          Histórico de tarefas
        </CardTitle>
        <CardDescription>
          Ordens de trabalho registadas neste espaço.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">A carregar…</p>
        ) : tasks.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Sem tarefas registadas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">ID</th>
                  <th className="px-3 py-2 font-medium">Tipo</th>
                  <th className="px-3 py-2 font-medium">Descrição</th>
                  <th className="px-3 py-2 font-medium">Agendada</th>
                  <th className="px-3 py-2 font-medium">Concluída</th>
                  <th className="px-3 py-2 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b last:border-b-0">
                    <td className="px-3 py-2 font-mono text-xs">{task.id.slice(0, 8)}</td>
                    <td className="px-3 py-2">{task.type}</td>
                    <td className="px-3 py-2">{task.description}</td>
                    <td className="px-3 py-2 tabular-nums">{formatDate(task.scheduledDate)}</td>
                    <td className="px-3 py-2 tabular-nums">{formatDate(task.completedAt)}</td>
                    <td className="px-3 py-2">
                      <Badge variant={statusVariant(task.status)}>
                        {statusLabels[task.status] ?? task.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
