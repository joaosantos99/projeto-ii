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
import { typeOptions } from "#/data/manutencao"

const typeLabels = typeOptions.reduce((acc, option) => {
  acc[option.value] = option.label
  return acc
}, {})

const statusLabels = {
  pending: "Pendente",
  in_progress: "Em execução",
  completed: "Concluída",
  cancelled: "Cancelada",
  pendente: "Pendente",
  em_execucao: "Em execução",
  concluida: "Concluída",
  cancelada: "Cancelada",
}

function statusVariant(status) {
  if (status === "completed" || status === "concluida") return "secondary"
  if (status === "in_progress" || status === "em_execucao") return "outline"
  if (status === "cancelled" || status === "cancelada") return "destructive"
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
        if (!cancelled) setTasks(Array.isArray(res.data?.data) ? res.data.data : [])
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
          <div className="flex min-h-[160px] flex-col items-center justify-center gap-1 border border-dashed p-6 text-center">
            <p className="text-sm font-medium">Nenhuma tarefa encontrada</p>
            <p className="text-xs text-muted-foreground">
              Sem tarefas registadas neste espaço.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">ID</th>
                  <th className="pb-2 pr-4 font-medium">Tipo</th>
                  <th className="pb-2 pr-4 font-medium">Descrição</th>
                  <th className="pb-2 pr-4 font-medium">Agendada</th>
                  <th className="pb-2 pr-4 font-medium">Concluída</th>
                  <th className="pb-2 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b border-border last:border-0">
                    <td className="py-2.5 pr-4 font-mono text-xs">{task.id.slice(0, 8)}</td>
                    <td className="py-2.5 pr-4">
                      <Badge variant="outline">{typeLabels[task.type] ?? task.type}</Badge>
                    </td>
                    <td className="py-2.5 pr-4">{task.description}</td>
                    <td className="py-2.5 pr-4 tabular-nums">{formatDate(task.scheduledDate)}</td>
                    <td className="py-2.5 pr-4 tabular-nums">{formatDate(task.completedAt)}</td>
                    <td className="py-2.5">
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
