'use client'

import { DndProvider, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"
import { TaskCard, TASK_CARD_TYPE } from "#/components/manutencao/task-card"

function BoardColumn({ column, onMoveTask, onLoadMore, onEditTask }) {
  const [{ isOver, canDrop }, dropRef] = useDrop(
    () => ({
      accept: TASK_CARD_TYPE,
      canDrop: (item) => item.status !== column.id,
      drop: (item) => onMoveTask?.(item.id, column.id),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [column.id, onMoveTask],
  )

  const active = isOver && canDrop

  return (
    <Card
      ref={dropRef}
      className={`bg-muted/20 transition-colors ${active ? "ring-2 ring-primary" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{column.title}</CardTitle>
          <Badge variant="secondary">{column.total}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex min-h-60 flex-col gap-3">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} />
        ))}
        {column.tasks.length === 0 ? (
          <div className="rounded-none border border-dashed p-4 text-center text-muted-foreground text-sm">
            Sem tarefas nesta coluna para os filtros atuais.
          </div>
        ) : null}
        {column.hasMore ? (
          <Button
            variant="outline"
            size="sm"
            className="mt-auto"
            disabled={column.loading}
            onClick={() => onLoadMore?.(column.id)}
          >
            {column.loading ? "A carregar…" : "Carregar mais"}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function Board({ columns, onMoveTask, onLoadMore, onEditTask }) {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map((column) => (
          <BoardColumn
            key={column.id}
            column={column}
            onMoveTask={onMoveTask}
            onLoadMore={onLoadMore}
            onEditTask={onEditTask}
          />
        ))}
      </div>
    </DndProvider>
  )
}
