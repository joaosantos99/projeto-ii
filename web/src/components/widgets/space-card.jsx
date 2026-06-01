import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"
import { Badge } from "#/components/ui/badge.jsx"
import { Button } from "#/components/ui/button.jsx"
import { Warning } from "@phosphor-icons/react"

export function SpaceCard({ space }) {
    return (
        <Card className="pt-0 overflow-hidden">
            <Link to="/space-public-page" className="block">
                <img src={space.image} alt={space.name} className="w-full h-48 object-cover"/>
                <CardHeader className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>{space.name}</CardTitle>
                            <CardDescription>{space.city}</CardDescription>
                        </div>
                        <Badge variant={
                            space.status === "Normal" ? "secondary" :
                            space.status === "Atenção" ? "warning" :
                            "destructive"
                        }>
                            {space.status ?? "Normal"}
                        </Badge>
                    </div>
                </CardHeader>
            </Link>
            <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-4 gap-2">
                    <div className="border border-border p-2 flex flex-col gap-1 justify-between">
                        <span className="text-xs text-muted-foreground uppercase">Humidade do solo</span>
                        <span className="text-sm font-medium">{space.humidity ?? "39 %"}</span>
                    </div>
                    <div className="border border-border p-2 flex flex-col gap-1 justify-between">
                        <span className="text-xs text-muted-foreground uppercase">Temperatura</span>
                        <span className="text-sm font-medium">{space.temperature ?? "31 C"}</span>
                    </div>
                    <div className="border border-border p-2 flex flex-col gap-1 justify-between">
                        <span className="text-xs text-muted-foreground uppercase">CO2</span>
                        <span className="text-sm font-medium">{space.co2 ?? "540 ppm"}</span>
                    </div>
                    <div className="border border-border p-2 flex flex-col gap-1 justify-between">
                        <span className="text-xs text-muted-foreground uppercase">Ruido</span>
                        <span className="text-sm font-medium">{space.noise ?? "41 dB"}</span>
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