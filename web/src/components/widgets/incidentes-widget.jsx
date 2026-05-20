'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"
import { Button } from "#/components/ui/button"
import { Badge } from "#/components/ui/badge"

const incidents = [
  { id: "INC-2041", space: "Parque da Cidade", issue: "Iluminacao intermitente", age: "Ha 42 min" },
  { id: "INC-2038", space: "Monsanto", issue: "Aspersor danificado", age: "Ha 1h 11m" },
  { id: "INC-2032", space: "Bucaco", issue: "Ruido elevado noturno", age: "Ha 2h 03m" },
]

export function IncidentesWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Incidentes de cidadaos por rever</CardTitle>
        <CardDescription>Ocorrencias mais recentes sem validacao</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {incidents.map((incident) => (
          <div key={incident.id} className="rounded-none border border-border p-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium">{incident.id}</p>
              <Badge variant="outline">{incident.age}</Badge>
            </div>
            <p className="mt-1 text-xs">{incident.issue}</p>
            <p className="text-xs text-muted-foreground">{incident.space}</p>
          </div>
        ))}
        <Button size="sm" variant="default">
          Rever fila de incidentes
        </Button>
      </CardContent>
    </Card>
  )
}