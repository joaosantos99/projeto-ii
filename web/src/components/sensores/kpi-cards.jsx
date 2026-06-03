'use client'

import { Pulse, BatteryWarning, Broadcast, Warning } from "@phosphor-icons/react"
import { KpiCard, KpiCardGrid } from "#/components/ui/kpi-card"

export function SensorsKpiCards({ summary }) {
  const {
    totalSensors = 0,
    totalActive = 0,
    totalNeedsAttention = 0,
    lowBattery = 0,
  } = summary ?? {}

  return (
    <KpiCardGrid>
      <KpiCard
        label="Inventário total"
        value={totalSensors}
        icon={<Pulse className="size-4 text-foreground" aria-hidden />}
        hint="Sensores registados no sistema"
      />
      <KpiCard
        label="Online"
        value={totalActive}
        icon={<Broadcast className="size-4 text-foreground" aria-hidden />}
        hint="Comunicação ativa"
      />
      <KpiCard
        label="Requer atenção"
        value={totalNeedsAttention}
        icon={<Warning className="size-4 text-foreground" aria-hidden />}
        hint="Inativos ou offline"
      />
      <KpiCard
        label="Bateria baixa"
        value={lowBattery}
        icon={<BatteryWarning className="size-4 text-foreground" aria-hidden />}
        hint="Até 20% de carga"
      />
    </KpiCardGrid>
  )
}
