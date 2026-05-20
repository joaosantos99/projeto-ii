import { Plus, Trash, Tree } from "@phosphor-icons/react"
import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"

export function ZonesTab({ zones, onAdd, onRemove }) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle className="flex items-center gap-2 text-base">
            <Tree />
            Zonas do espaço
          </CardTitle>
          <CardDescription>
            Lista editável — adicione ou remova subdivisões monitorizadas.
          </CardDescription>
        </div>
        <Button size="sm" onClick={onAdd}>
          <Plus />
          Adicionar zona
        </Button>
      </CardHeader>
      <CardContent>
        {zones.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Ainda sem zonas — use “Adicionar zona” para criar a primeira.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Zona</th>
                  <th className="px-3 py-2 font-medium">Descrição</th>
                  <th className="w-16 px-3 py-2 text-right font-medium">Ação</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((zone) => (
                  <tr key={zone.id} className="border-b last:border-b-0">
                    <td className="px-3 py-2 font-medium">{zone.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {zone.description}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remover ${zone.name}`}
                        onClick={() => onRemove(zone.id)}
                      >
                        <Trash />
                      </Button>
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
