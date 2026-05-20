'use client'

import { Warning, WarningCircle, Broadcast, Gauge } from "@phosphor-icons/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"

const kpis = [
  {
    title: "Alertas criticos",
    value: "2",
    description: "+2 nas ultimas 24h",
    Icon: Warning,
  },
  {
    title: "Manutencao em atraso",
    value: "0",
    description: "Prioridade de despacho",
    Icon: WarningCircle,
  },
  {
    title: "Sensores offline",
    value: "1",
    description: "Intervencao recomendada",
    Icon: Broadcast,
  },
  {
    title: "Tempo medio de resposta",
    value: "41 min",
    description: "-8% face a semana passada",
    Icon: Gauge,
  },
]

export function KpisWidget() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map(({ title, value, description, Icon }) => (
        <Card key={title}>
          <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
            <CardTitle>{title}</CardTitle>
            <Icon className="size-4 shrink-0 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{value}</p>
            <CardDescription>{description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}