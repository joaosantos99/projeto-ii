'use client'

import { Badge } from "#/components/ui/badge"
import { Card, CardContent } from "#/components/ui/card"

export function TaskCard({ task }) {
  return (
    <Card>
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