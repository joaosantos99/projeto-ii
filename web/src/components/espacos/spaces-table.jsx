import { PencilSimple, Prohibit } from "@phosphor-icons/react"
import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import { operationalStatusLabels } from "#/data/espacos"

function statusBadgeVariant(status) {
  if (status === "inativo") return "destructive"
  if (status === "em_manutencao") return "outline"
  return "secondary"
}

export function SpacesTable({ spaces, onEdit, onDeactivate }) {
  if (spaces.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Sem resultados para os filtros atuais.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b text-left text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">Nome</th>
            <th className="px-3 py-2 font-medium">Cidade</th>
            <th className="px-3 py-2 text-right font-medium">Zonas</th>
            <th className="px-3 py-2 text-right font-medium">Sensores</th>
            <th className="px-3 py-2 text-right font-medium">Alertas ativos</th>
            <th className="px-3 py-2 font-medium">Estado</th>
            <th className="w-24 px-3 py-2 text-right font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {spaces.map((space) => (
            <tr key={space.id} className="border-b last:border-b-0">
              <td className="px-3 py-2">
                <div className="flex flex-col gap-0.5">
                  <p className="font-medium">{space.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {space.district} · {space.postalCode}
                  </p>
                </div>
              </td>
              <td className="px-3 py-2">{space.municipality}</td>
              <td className="px-3 py-2 text-right tabular-nums">{space.zonesCount}</td>
              <td className="px-3 py-2 text-right tabular-nums">{space.sensorsCount}</td>
              <td className="px-3 py-2 text-right tabular-nums">{space.activeAlerts}</td>
              <td className="px-3 py-2">
                <Badge variant={statusBadgeVariant(space.operationalStatus)}>
                  {operationalStatusLabels[space.operationalStatus]}
                </Badge>
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Editar ${space.name}`}
                    onClick={() => onEdit(space.id)}
                  >
                    <PencilSimple />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Desativar ${space.name}`}
                    disabled={space.operationalStatus === "inativo"}
                    onClick={() => onDeactivate(space.id)}
                  >
                    <Prohibit />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
