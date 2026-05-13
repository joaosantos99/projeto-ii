import { Badge } from "#/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"
import { TaskCard } from "#/components/manutencao/task-card"
import { boardColumns } from "#/data/manutencao"

export function Board({ tasks }) {
  const groupedTasks = boardColumns.map((column) => ({
    ...column,
    tasks: tasks.filter((task) => task.status === column.id),
  }))

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {groupedTasks.map((column) => (
        <Card key={column.id} className="bg-muted/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{column.title}</CardTitle>
              <Badge variant="secondary">{column.tasks.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex min-h-60 flex-col gap-3">
            {column.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {column.tasks.length === 0 ? (
              <div className="rounded-none border border-dashed p-4 text-center text-muted-foreground text-sm">
                Sem tarefas nesta coluna para os filtros atuais.
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
