'use client'

import { useDrag } from "react-dnd"

import { Badge } from "#/components/ui/badge"
import { Card, CardContent } from "#/components/ui/card"

export const TASK_CARD_TYPE = "manutencao-task"

export function TaskCard({ task }) {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: TASK_CARD_TYPE,
      item: { id: task.id, status: task.status },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [task.id, task.status],
  )

  return (
    <Card
      ref={dragRef}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? "opacity-40" : ""}`}
    >
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-sm">{task.title}</p>
          <p className="text-muted-foreground text-xs">{task.id}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{task.zone}</Badge>
          <Badge variant={task.priority === "critical" ? "destructive" : "secondary"}>
            {task.priority}
          </Badge>
        </div>
        <p className="text-muted-foreground text-xs">
          Técnico: {task.technician} • Prazo: {task.dueDate}
        </p>
      </CardContent>
    </Card>
  )
}