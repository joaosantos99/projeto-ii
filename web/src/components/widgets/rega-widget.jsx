'use client'

import { Heartbeat, Lightning } from "@phosphor-icons/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"
import { Badge } from "#/components/ui/badge"

const spaces = Array.from({ length: 7 }, () => ({
  space: "Monsanto",
  irrigation: true,
  lighting: true,
}))

export function RegaWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de rega e iluminacao</CardTitle>
        <CardDescription>Indicadores por espaco</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {spaces.map((space, index) => (
            <div key={index} className="rounded-none border border-border p-2">
              <p className="text-xs font-medium">{space.space}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant={space.irrigation ? "secondary" : "outline"}>
                  <Heartbeat className="size-3" />
                  Rega {space.irrigation ? "ON" : "OFF"}
                </Badge>
                <Badge variant={space.lighting ? "secondary" : "outline"}>
                  <Lightning className="size-3" />
                  Luz {space.lighting ? "ON" : "OFF"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}