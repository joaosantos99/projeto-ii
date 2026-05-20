'use client'

import { Warning, Clock, Wrench } from "@phosphor-icons/react"
import { Badge } from "#/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"

function KpiCard({ label, value, icon, hint, valueClassName }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-semibold tabular-nums ${valueClassName ?? ""}`}>{value}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}

export function KpiCards({ tasks }) {
  const pendingCount = tasks.filter((t) => t.status === "pendente").length
  const inProgressCount = tasks.filter((t) => t.status === "em_execucao").length
  const criticalCount = tasks.filter((t) => t.priority === "critical").length
  const overdueCount = tasks.filter(
    (t) => t.dueDate < "2026-03-24" && t.status !== "concluida"
  ).length

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Pendentes"
        value={pendingCount}
        icon={<Clock className="size-4 text-muted-foreground" aria-hidden />}
        hint="Aguardam atribuição e arranque"
      />
      <KpiCard
        label="Em execução"
        value={inProgressCount}
        icon={<Wrench className="size-4 text-chart-1" aria-hidden />}
        hint="Intervenções no terreno"
        valueClassName="text-chart-1"
      />
      <KpiCard
        label="Críticas"
        value={criticalCount}
        icon={<Badge variant="destructive">{criticalCount}</Badge>}
        hint="Prioridade máxima ativa"
      />
      <KpiCard
        label="Em atraso"
        value={overdueCount}
        icon={<Warning className="size-4 text-muted-foreground" aria-hidden />}
        hint="Com prazo anterior a hoje"
      />
    </section>
  )
}