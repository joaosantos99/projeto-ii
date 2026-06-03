'use client'

import { useMemo } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"

export function SensorsDistributionChart({ distribution }) {
  const data = useMemo(() => {
    const { online = 0, degraded = 0, offline = 0 } = distribution ?? {}
    return [
      { label: "Online", count: online, color: "bg-chart-1" },
      { label: "Degradado", count: degraded, color: "bg-chart-4" },
      { label: "Offline", count: offline, color: "bg-destructive" },
    ]
  }, [distribution])

  const max = Math.max(1, ...data.map((d) => d.count))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado por categoria</CardTitle>
        <CardDescription>
          Distribuição de sensores no inventário completo (independente dos filtros).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-[200px] items-end gap-4 pt-4">
          {data.map((d) => {
            const heightPct = (d.count / max) * 100
            return (
              <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className={`w-full rounded-t-md transition-all ${d.color}`}
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
