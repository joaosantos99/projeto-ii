import { Badge } from "#/components/ui/badge"
import { operationalStatusLabels, severityLabels } from "#/data/espacos"

function severityVariant(status) {
  if (status === "critical") return "destructive"
  if (status === "warning") return "outline"
  return "secondary"
}

export function DetailHeader({ space }) {
  return (
    <div className="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            {space.name}
          </h1>
          <Badge variant={severityVariant(space.status)}>
            {severityLabels[space.status]}
          </Badge>
          <Badge variant="outline">
            {operationalStatusLabels[space.operationalStatus]}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {space.municipality} · {space.district} · {space.areaHa} ha
        </p>
      </div>
    </div>
  )
}
