'use client'

import { Bell, ListChecks, Warning, WarningCircle } from "@phosphor-icons/react"
import { KpiCard, KpiCardGrid } from "#/components/ui/kpi-card"

export function AlertsKpiCards({ summary }) {
  const {
    totalActiveRules = 0,
    totalToRecognize = 0,
    totalCriticalAlerts = 0,
    totalAlerts = 0,
  } = summary ?? {}

  return (
    <KpiCardGrid>
      <KpiCard
        label="Regras ativas"
        value={totalActiveRules}
        icon={<ListChecks className="size-4 text-muted-foreground" aria-hidden />}
        hint="Monitorização automática"
      />
      <KpiCard
        label="Por reconhecer"
        value={totalToRecognize}
        icon={<WarningCircle className="size-4 text-muted-foreground" aria-hidden />}
        hint="Aguardam validação"
      />
      <KpiCard
        label="Críticos em aberto"
        value={totalCriticalAlerts}
        icon={<Warning className="size-4 text-muted-foreground" aria-hidden />}
        hint="Sem reconhecimento"
      />
      <KpiCard
        label="Disparos registados"
        value={totalAlerts}
        icon={<Bell className="size-4 text-muted-foreground" aria-hidden />}
        hint="Histórico na plataforma"
      />
    </KpiCardGrid>
  )
}
