'use client'

import {
  CalendarBlank,
  CheckCircle,
  Clock,
  Stack,
} from "@phosphor-icons/react"
import { KpiCard, KpiCardGrid } from "#/components/ui/kpi-card"

export function KpiCards({ reports }) {
  const generatedCount = reports.filter((r) => r.status === "gerado").length
  const scheduledCount = reports.filter((r) => r.status === "agendado").length
  const lastCreated = reports.reduce(
    (latest, r) => (r.createdAt > latest ? r.createdAt : latest),
    reports[0]?.createdAt ?? ""
  )

  return (
    <KpiCardGrid>
      <KpiCard
        label="Total no histórico"
        value={reports.length}
        icon={<Stack className="size-4 text-muted-foreground" aria-hidden />}
        hint="Inclui gerados e agendados"
      />
      <KpiCard
        label="Gerados"
        value={generatedCount}
        icon={<CheckCircle className="size-4 text-chart-1" aria-hidden />}
        hint="Prontos para exportar"
        valueClassName="text-chart-1"
      />
      <KpiCard
        label="Agendados"
        value={scheduledCount}
        icon={<Clock className="size-4 text-muted-foreground" aria-hidden />}
        hint="Em fila de processamento"
      />
      <KpiCard
        label="Última criação"
        value={lastCreated || "—"}
        icon={<CalendarBlank className="size-4 text-muted-foreground" aria-hidden />}
        hint="Registo mais recente"
        valueClassName="text-lg leading-tight"
      />
    </KpiCardGrid>
  )
}
