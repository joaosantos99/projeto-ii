'use client'

import { useDrag } from "react-dnd"

import { Badge } from "#/components/ui/badge"
import { Card, CardContent } from "#/components/ui/card"
import { typeOptions, priorityOptions } from "#/data/manutencao"

export const TASK_CARD_TYPE = "manutencao-task"

const ZONE_LABELS = Object.fromEntries(
  typeOptions.map((option) => [option.value, option.label]),
)
const PRIORITY_LABELS = Object.fromEntries(
  priorityOptions.map((option) => [option.value, option.label]),
)

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
        <p className="font-medium text-sm">{task.title}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{ZONE_LABELS[task.zone] ?? task.zone}</Badge>
          <Badge variant={task.priority === "critical" ? "destructive" : "secondary"}>
            {PRIORITY_LABELS[task.priority] ?? task.priority}
          </Badge>
        </div>
        <p className="text-muted-foreground text-xs">Prazo: {task.dueDate}</p>
      </CardContent>
    </Card>
  )
}