'use client'

import { useMemo } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { typeLabels } from "#/data/relatorios"

const TYPES = ["operacional", "ambiental", "incidentes"]

export function VolumeChart({ reports }) {
  const data = useMemo(() => {
    const counts = { operacional: 0, ambiental: 0, incidentes: 0 }
    for (const r of reports) counts[r.type]++
    return TYPES.map((key) => ({ label: typeLabels[key], count: counts[key] }))
  }, [reports])

  const max = Math.max(1, ...data.map((d) => d.count))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Volume por tipo</CardTitle>
        <CardDescription>
          Distribuição dos relatórios no conjunto atual do histórico.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-[220px] items-end gap-4 pt-4">
          {data.map((d) => {
            const heightPct = (d.count / max) * 100
            return (
              <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-chart-1 transition-all"
                    style={{ height: `${heightPct}%` }}
                    aria-label={`${d.label}: ${d.count}`}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-semibold tabular-nums">{d.count}</span>
                  <span className="text-xs text-muted-foreground">{d.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}