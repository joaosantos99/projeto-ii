import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"

export function MapWidget({ spaces }) {
    return (
        <MapContainer
            center={[39.5, -8]}
            zoom={7}
            className="w-full h-96"
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