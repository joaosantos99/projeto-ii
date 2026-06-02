'use client'

import { Buildings, Cpu, MapPin, Tree } from "@phosphor-icons/react"
import { KpiCard, KpiCardGrid } from "#/components/ui/kpi-card"

export function KpiCards({ summary }) {
  const spacesCount = summary?.spacesCount ?? 0
  const zonesCount = summary?.zonesCount ?? 0
  const activeCount = summary?.activeCount ?? 0
  const districtsCount = summary?.districtsCount ?? 0

  return (
    <KpiCardGrid>
      <KpiCard
        label="Espaços registados"
        value={spacesCount}
        icon={<MapPin className="size-4 text-muted-foreground" aria-hidden />}
        hint="Total na plataforma"
      />
      <KpiCard
        label="Zonas mapeadas"
        value={zonesCount}
        icon={<Tree className="size-4 text-muted-foreground" aria-hidden />}
        hint="Subdivisões por espaço"
      />
      <KpiCard
        label="Sensores ativos"
        value={activeCount}
        icon={<Cpu className="size-4 text-muted-foreground" aria-hidden />}
        hint="A reportar dados"
      />
      <KpiCard
        label="Cidades"
        value={districtsCount}
        icon={<Buildings className="size-4 text-muted-foreground" aria-hidden />}
        hint="Cobertura geográfica"
      />
    </KpiCardGrid>
  )
}
