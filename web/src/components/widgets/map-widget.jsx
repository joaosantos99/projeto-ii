'use client'

import { useEffect, useState } from "react"

// react-leaflet pulls in leaflet, which touches `window` at module load and
// crashes during SSR. Load it lazily in the browser only.
export function MapWidget({ spaces }) {
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
    return <div className="w-full h-96 overflow-hidden bg-muted" />
  }

  const { MapContainer, TileLayer, Marker, Popup } = leaflet

  return (
    <MapContainer
      center={[39.5, -8]}
      zoom={7}
      className="w-full h-96 overflow-hidden"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {spaces.map((space) => (
        <Marker key={space.id} position={[space.latitude, space.longitude]}>
          <Popup>{space.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
