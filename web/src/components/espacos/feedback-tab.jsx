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
      <CardContent>
        {feedback.length === 0 ? (
          <div className="flex min-h-[160px] flex-col items-center justify-center gap-1 border border-dashed p-6 text-center">
            <ChatCircle className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium">Nenhum feedback encontrado</p>
            <p className="text-xs text-muted-foreground">
              Ainda não há comentários públicos para moderar.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Autor</th>
                  <th className="pb-2 pr-4 font-medium">Comentário</th>
                  <th className="pb-2 pr-4 font-medium">Data</th>
                  <th className="pb-2 text-right font-medium">Ação</th>
                </tr>
              </thead>
              <tbody>
                {feedback.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="py-2.5 pr-4 font-medium">{item.author}</td>
                    <td className="py-2.5 pr-4">{item.body}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground tabular-nums">{item.createdAt}</td>
                    <td className="py-2.5 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remover comentário de ${item.author}`}
                        onClick={() => handleRemove(item.id)}
                      >
                        <Trash />
                      </Button>
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
