import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"
import { Button } from "#/components/ui/button.jsx"
import { Warning } from "@phosphor-icons/react"

// Latest sensor reading per metric (sensor_reading_metas.dump). "—" when none.
function reading(space, metric) {
    const r = space.readings?.[metric]
    if (!r || r.value == null) return "—"
    return `${r.value}${r.unit ? ` ${r.unit}` : ""}`
}

export function SpaceCard({ space }) {
    return (
        <Card className="pt-0 overflow-hidden">
            <Link to={`/espacos-verdes/${space.id}`} className="block">
                <img src={space.image} alt={space.name} className="w-full h-48 object-cover"/>
                <CardHeader className="pt-6">
                    <CardTitle>{space.name}</CardTitle>
                    <CardDescription>{space.parish}</CardDescription>
                </CardHeader>
            </Link>
            <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-4 gap-2">
                    <div className="border border-border p-2 flex flex-col gap-1 justify-between">
                        <span className="text-xs text-muted-foreground uppercase">Humidade do solo</span>
                        <span className="text-sm font-medium">{reading(space, "soilMoisture")}</span>
                    </div>
                    <div className="border border-border p-2 flex flex-col gap-1 justify-between">
                        <span className="text-xs text-muted-foreground uppercase">Temperatura</span>
                        <span className="text-sm font-medium">{reading(space, "temperature")}</span>
                    </div>
                    <div className="border border-border p-2 flex flex-col gap-1 justify-between">
                        <span className="text-xs text-muted-foreground uppercase">CO2</span>
                        <span className="text-sm font-medium">{reading(space, "co2")}</span>
                    </div>
                    <div className="border border-border p-2 flex flex-col gap-1 justify-between">
                        <span className="text-xs text-muted-foreground uppercase">Ruido</span>
                        <span className="text-sm font-medium">{reading(space, "noise")}</span>
                    </div>
                </div>
                <Button variant="outline" className="w-full">
                    <Warning/>
                    Reportar
                </Button>
            </CardContent>
        </Card>
    )
}