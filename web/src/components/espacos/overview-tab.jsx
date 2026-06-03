'use client'

import { useEffect, useState } from "react"
import { MapPin } from "@phosphor-icons/react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import "leaflet/dist/leaflet.css"

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

function formatDate(value) {
  if (!value) return "—"
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("pt-PT")
}

function SpaceMap({ lat, lng, name }) {
  const [leaflet, setLeaflet] = useState(null)

  useEffect(() => {
    let cancelled = false
    import("react-leaflet").then((mod) => {
      if (!cancelled) setLeaflet(mod)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!leaflet) {
    return <div className="h-64 w-full bg-muted" />
  }

  const { MapContainer, TileLayer, Marker, Popup } = leaflet

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={14}
      className="h-64 w-full overflow-hidden rounded-md border"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]}>
        <Popup>{name}</Popup>
      </Marker>
    </MapContainer>
  )
}

export function OverviewTab({ space }) {
  const lat = Number(space?.latitude)
  const lng = Number(space?.longitude)
  const latStr = Number.isFinite(lat) ? lat.toFixed(5) : "—"
  const lngStr = Number.isFinite(lng) ? lng.toFixed(5) : "—"
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng)

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
          {hasCoords ? (
            <SpaceMap lat={lat} lng={lng} name={space?.name} />
          ) : (
            <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-muted/30 text-center">
              <MapPin className="size-8 text-muted-foreground" />
              <p className="text-sm font-medium">
                {latStr}, {lngStr}
              </p>
              <p className="text-xs text-muted-foreground">
                Coordenadas indisponíveis.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Metadados</CardTitle>
          <CardDescription>Registo administrativo do espaço.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Freguesia" value={space?.parish ?? "—"} />
            <Field label="Código postal" value={space?.postal_code ?? "—"} />
          </div>
          <div className="border-t border-border" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Latitude" value={latStr} mono />
            <Field label="Longitude" value={lngStr} mono />
          </div>
          <Field label="Criado" value={formatDate(space?.createdAt)} />
        </CardContent>
      </Card>
    </div>
  )
}
