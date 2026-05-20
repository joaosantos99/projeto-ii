import { ShieldWarning } from "@phosphor-icons/react"
import { Badge } from "#/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import {
  incidentStateOptions,
  severityLabels,
} from "#/data/espacos"
import { selectClass } from "#/data/manutencao"

function severityVariant(severity) {
  if (severity === "critical") return "destructive"
  if (severity === "warning") return "outline"
  return "secondary"
}

export function IncidentsTab({ incidents, onStateChange }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldWarning />
          Relatos de cidadãos
        </CardTitle>
        <CardDescription>
          Atualize o estado de triagem diretamente na tabela.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {incidents.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Sem incidentes para este espaço.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">ID</th>
                  <th className="px-3 py-2 font-medium">Descrição</th>
                  <th className="px-3 py-2 font-medium">Zona</th>
                  <th className="px-3 py-2 font-medium">Gravidade</th>
                  <th className="px-3 py-2 font-medium">Reportado</th>
                  <th className="px-3 py-2 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.id} className="border-b last:border-b-0">
                    <td className="px-3 py-2 font-mono text-xs">{incident.id}</td>
                    <td className="px-3 py-2">{incident.title}</td>
                    <td className="px-3 py-2">{incident.zone}</td>
                    <td className="px-3 py-2">
                      <Badge variant={severityVariant(incident.severity)}>
                        {severityLabels[incident.severity]}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 tabular-nums text-muted-foreground">
                      {incident.reportedAt}
                    </td>
                    <td className="px-3 py-2">
                      <select
                        aria-label={`Estado de ${incident.id}`}
                        className={`${selectClass} h-8 min-w-32`}
                        value={incident.state}
                        onChange={(event) => onStateChange(incident.id, event.target.value)}
                      >
                        {incidentStateOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
