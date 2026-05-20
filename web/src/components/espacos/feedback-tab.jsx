'use client'

import { useState } from "react"
import { ChatCircle, Trash } from "@phosphor-icons/react"
import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"

export function FeedbackTab() {
  const [feedback, setFeedback] = useState([])

  const handleRemove = (id) => {
    setFeedback((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ChatCircle />
          Comentários e moderação
        </CardTitle>
        <CardDescription>
          Remova mensagens inadequadas — ação imediata.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {feedback.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <ChatCircle className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium">Sem feedback</p>
            <p className="text-xs text-muted-foreground">
              Ainda não há comentários públicos para moderar.
            </p>
          </div>
        ) : (
          feedback.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-md border bg-card/50 p-3 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <p className="text-xs text-muted-foreground">
                  {item.author} · {item.createdAt}
                </p>
                <p className="text-sm leading-relaxed">{item.body}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => handleRemove(item.id)}
              >
                <Trash />
                Eliminar
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
