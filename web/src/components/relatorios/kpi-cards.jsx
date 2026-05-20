import {
  CalendarBlank,
  CheckCircle,
  Clock,
  Stack,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"

function KpiCard({ label, value, icon, hint, valueClassName }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-semibold tabular-nums ${valueClassName ?? ""}`}>
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}

export function KpiCards({ reports }) {
  const generatedCount = reports.filter((r) => r.status === "gerado").length
  const scheduledCount = reports.filter((r) => r.status === "agendado").length
  const lastCreated = reports.reduce(
    (latest, r) => (r.createdAt > latest ? r.createdAt : latest),
    reports[0]?.createdAt ?? ""
  )

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
    </section>
  )
}
