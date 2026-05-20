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

export function KpiCards({ spaces, districtCount }) {
  const totalZones = spaces.reduce((acc, s) => acc + s.zonesCount, 0)
  const activeCount = spaces.filter((s) => s.operationalStatus === "ativo").length

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Espaços registados"
        value={spaces.length}
        icon={<MapPin className="size-4 text-chart-1" aria-hidden />}
        hint="Inclui novos rascunhos locais"
      />
      <KpiCard
        label="Zonas mapeadas"
        value={totalZones}
        icon={<Tree className="size-4 text-muted-foreground" aria-hidden />}
        hint="Subdivisões por espaço"
      />
      <KpiCard
        label="Ativos"
        value={activeCount}
        icon={<Badge variant="secondary">{activeCount}</Badge>}
        hint="Estado operacional normal"
      />
      <KpiCard
        label="Distritos"
        value={districtCount}
        icon={<Badge variant="outline">{districtCount}</Badge>}
        hint="Cobertura geográfica"
      />
    </section>
  )
}