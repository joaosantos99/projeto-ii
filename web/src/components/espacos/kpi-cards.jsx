'use client'

import { MapPin, Tree } from "@phosphor-icons/react"
import { Badge } from "#/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"

function KpiCard({ label, value, icon, hint }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}

export function KpiCards({ summary }) {
  const spacesCount = summary?.spacesCount ?? 0
  const zonesCount = summary?.zonesCount ?? 0
  const activeCount = summary?.activeCount ?? 0
  const districtsCount = summary?.districtsCount ?? 0

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Espaços registados"
        value={spacesCount}
        icon={<MapPin className="size-4 text-chart-1" aria-hidden />}
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
        icon={<Badge variant="secondary">{activeCount}</Badge>}
        hint="A reportar dados"
      />
      <KpiCard
        label="Cidades"
        value={districtsCount}
        icon={<Badge variant="outline">{districtsCount}</Badge>}
        hint="Cobertura geográfica"
      />
    </section>
  )
}
