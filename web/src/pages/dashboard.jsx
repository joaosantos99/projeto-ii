'use client'

import { useEffect, useState, useMemo } from "react"
import { useOutletContext } from "react-router-dom"
import {
  Alarm,
  Broadcast,
  CheckCircle,
  Gauge,
  Heartbeat,
  Lightning,
  Warning,
  WarningCircle,
} from "@phosphor-icons/react"
import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import { KpiCard, KpiCardGrid } from "#/components/ui/kpi-card"
import { Widget, WidgetTile } from "#/components/ui/widget"
import { cn } from "#/lib/utils"

const kpis = [
  { label: "Alertas criticos", value: "2", hint: "+2 nas ultimas 24h", Icon: Warning },
  { label: "Manutencao em atraso", value: "0", hint: "Prioridade de despacho", Icon: WarningCircle },
  { label: "Sensores offline", value: "1", hint: "Intervencao recomendada", Icon: Broadcast },
  { label: "Tempo medio de resposta", value: "41 min", hint: "-8% face a semana passada", Icon: Gauge },
]

const incidents = [
  { id: "INC-2041", space: "Parque da Cidade", issue: "Iluminacao intermitente", age: "Ha 42 min" },
  { id: "INC-2038", space: "Monsanto", issue: "Aspersor danificado", age: "Ha 1h 11m" },
  { id: "INC-2032", space: "Bucaco", issue: "Ruido elevado noturno", age: "Ha 2h 03m" },
]

const regaSpaces = Array.from({ length: 7 }, () => ({
  space: "Monsanto",
  irrigation: true,
  lighting: true,
}))

const alerts = [
  { id: "ALR-8812", rule: "Ruido elevado prolongado", space: "Parque Florestal de Monsanto", severity: "critical", happenedAt: "2026-03-23 09:10", acknowledged: false },
  { id: "ALR-8798", rule: "Humidade abaixo de 35%", space: "Parque da Cidade", severity: "critical", happenedAt: "2026-03-22 22:19", acknowledged: false },
  { id: "ALR-8806", rule: "Temperatura acima do limite", space: "Mata Nacional do Bucaco", severity: "warning", happenedAt: "2026-03-23 08:24", acknowledged: true },
]

const PAGE_SIZE = 4

export function DashboardPage() {
  const { setTitle } = useOutletContext()

  useEffect(() => {
    setTitle("Visão geral")
  }, [setTitle])

  const [page, setPage] = useState(1)
  const sortedAlerts = useMemo(() => {
    const rank = { critical: 3, warning: 2, normal: 1 }
    return [...alerts].sort((a, b) => (rank[b.severity] ?? 0) - (rank[a.severity] ?? 0))
  }, [])

  const totalPages = Math.max(1, Math.ceil(sortedAlerts.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedAlerts = sortedAlerts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="flex flex-col gap-4">
      <KpiCardGrid>
        {kpis.map(({ label, value, hint, Icon }) => (
          <KpiCard
            key={label}
            label={label}
            value={value}
            hint={hint}
            icon={<Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />}
          />
        ))}
      </KpiCardGrid>

      <Widget
        title="Alertas ativos"
        description="Lista priorizada por severidade com acao imediata"
        action={
          <Button variant="outline" size="sm">
            <Alarm className="size-3.5" />
            Ver todos
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Regra</th>
                <th className="pb-2 pr-4 font-medium">Espaco</th>
                <th className="pb-2 pr-4 font-medium">Severidade</th>
                <th className="pb-2 pr-4 font-medium">Data</th>
                <th className="pb-2 text-right font-medium">Acao</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAlerts.map((alert) => (
                <tr key={alert.id} className="border-b border-border last:border-0">
                  <td className="py-2.5 pr-4">{alert.rule}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground">{alert.space}</td>
                  <td className="py-2.5 pr-4">
                    <Badge variant={alert.severity === "critical" ? "destructive" : "warning"}>
                      {alert.severity === "critical" ? "Critico" : "Warning"}
                    </Badge>
                  </td>
                  <td className="py-2.5 pr-4 text-muted-foreground">{alert.happenedAt}</td>
                  <td className="py-2.5 text-right">
                    <Button
                      size="xs"
                      variant={alert.acknowledged ? "secondary" : "outline"}
                      className={alert.acknowledged ? "bg-green-50 text-green-700 ring-1 ring-green-200 hover:bg-green-100" : ""}
                    >
                      {alert.acknowledged ? (
                        <>
                          <CheckCircle className="size-3" />
                          Confirmado
                        </>
                      ) : (
                        <>
                          <Alarm className="size-3" />
                          Confirmar
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            {sortedAlerts.length} alerta(s) encontrados - pagina {currentPage} de {totalPages}
          </p>
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded-none px-2 py-1 text-xs text-muted-foreground ring-1 ring-border hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
            >
              &lt; Anterior
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={cn(
                  "flex size-6 items-center justify-center rounded-none text-xs ring-1",
                  currentPage === i + 1
                    ? "bg-primary text-primary-foreground ring-primary"
                    : "ring-border hover:bg-muted"
                )}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 rounded-none px-2 py-1 text-xs text-muted-foreground ring-1 ring-border hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
            >
              Seguinte &gt;
            </button>
          </div>
        </div>
      </Widget>

      <section className="grid gap-4 xl:grid-cols-2">
        <Widget
          title="Estado de rega e iluminacao"
          description="Indicadores por espaco"
        >
          <div className="grid grid-cols-2 gap-2">
            {regaSpaces.map((space, index) => (
              <WidgetTile key={index}>
                <p className="text-xs font-medium">{space.space}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant={space.irrigation ? "secondary" : "outline"}>
                    <Heartbeat className="size-3" />
                    Rega {space.irrigation ? "ON" : "OFF"}
                  </Badge>
                  <Badge variant={space.lighting ? "secondary" : "outline"}>
                    <Lightning className="size-3" />
                    Luz {space.lighting ? "ON" : "OFF"}
                  </Badge>
                </div>
              </WidgetTile>
            ))}
          </div>
        </Widget>

        <Widget
          title="Incidentes de cidadaos por rever"
          description="Ocorrencias mais recentes sem validacao"
          contentClassName="flex flex-col gap-2"
        >
          {incidents.map((incident) => (
            <WidgetTile key={incident.id}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium">{incident.id}</p>
                <Badge variant="outline">{incident.age}</Badge>
              </div>
              <p className="mt-1 text-xs">{incident.issue}</p>
              <p className="text-xs text-muted-foreground">{incident.space}</p>
            </WidgetTile>
          ))}
          <Button size="sm" variant="default">
            Rever fila de incidentes
          </Button>
        </Widget>
      </section>
    </div>
  )
}
