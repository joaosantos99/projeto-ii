import { Wrench } from "@phosphor-icons/react"
import { Badge } from "#/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { taskStatusLabels } from "#/data/espacos"

function priorityVariant(priority) {
  if (priority === "critical") return "destructive"
  if (priority === "warning") return "outline"
  return "secondary"
}

export function MaintenanceTab({ tasks }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Wrench />
          Histórico de tarefas
        </CardTitle>
        <CardDescription>
          Ordens de trabalho e prioridades por zona.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Sem tarefas registadas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">ID</th>
                  <th className="px-3 py-2 font-medium">Tarefa</th>
                  <th className="px-3 py-2 font-medium">Zona</th>
                  <th className="px-3 py-2 font-medium">Técnico</th>
                  <th className="px-3 py-2 font-medium">Prazo</th>
                  <th className="px-3 py-2 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b last:border-b-0">
                    <td className="px-3 py-2 font-mono text-xs">{task.id}</td>
                    <td className="px-3 py-2">{task.title}</td>
                    <td className="px-3 py-2">{task.zone}</td>
                    <td className="px-3 py-2">{task.technician}</td>
                    <td className="px-3 py-2 tabular-nums">{task.dueDate}</td>
                    <td className="px-3 py-2">
                      <Badge variant={priorityVariant(task.priority)}>
                        {taskStatusLabels[task.status]}
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
