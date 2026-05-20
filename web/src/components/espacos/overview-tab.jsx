'use client'

import { MapPin } from "@phosphor-icons/react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"

function Field({ label, value, mono }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={mono ? "font-mono text-sm tabular-nums" : "text-sm font-medium"}>
        {value}
      </p>
    </div>
  )
}

export function OverviewTab({ space }) {
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin />
            Localização
          </CardTitle>
          <CardDescription>
            Pré-visualização do ponto geográfico do espaço.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-muted/30 text-center">
            <MapPin className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium">
              {space.lat.toFixed(5)}, {space.lng.toFixed(5)}
            </p>
            <p className="text-xs text-muted-foreground">
              Mapa interativo indisponível neste demo.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Metadados</CardTitle>
          <CardDescription>Registo administrativo do espaço.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Cidade" value={space.municipality} />
            <Field label="Distrito" value={space.district} />
            <Field label="Código postal" value={space.postalCode} />
            <Field label="Área" value={`${space.areaHa} ha`} />
          </div>
          <div className="border-t" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Latitude" value={space.lat.toFixed(5)} mono />
            <Field label="Longitude" value={space.lng.toFixed(5)} mono />
          </div>
          <Field label="Incidentes ativos (agregado)" value={space.activeIncidents} />
        </CardContent>
      </Card>
    </div>
  )
}