'use client'

import { useEffect, useState } from "react"
import { api } from "#/lib/api"
import { Navbar } from "#/components/navbar"
import { Button } from '#/components/ui/button'
import { SectionLayout } from "#/components/landing-layout"
import { SpaceCard } from "#/components/widgets/space-card"
import { MapWidget } from "#/components/widgets/map-widget"
import { Footer } from "#/components/footer"

export function LandingPage() {
    const [spaces, setspaces] = useState([])

    useEffect(() => {
        api.get("/spaces/public")
           .then((res) => setspaces(res.data.spaces))
           .catch(() => setspaces([]))
        }, [])

    return (
        <div>
            <Navbar />
            <div className="flex items-center px-12 py-24 bg-linear-to-b from-[#BCE3C3] via-[#BCE3C3] via-35% to-[#E2F9E2]">
                <div className="flex flex-col gap-8 max-w-110">
                    <h3 className="font-landing italic text-4xl">Portal de monitorização de <span className="text-primary">espaços verdes</span></h3>
                    <p className="">Consultar espaços sensores e ocorrências em tempo real por município</p>
                    <Button className="w-fit">Explorar espaço</Button>
                </div>
            </div>
            <SectionLayout title="Mapa de rede" description="Vista geográfica dos espaços verdes em monitorização">
                <MapWidget spaces={spaces}/>
            </SectionLayout>
            <hr className="border-0 h-px mx-12 my-6 bg-linear-to-r from-transparent via-black/20 to-transparent" />
            <SectionLayout title="Espaços em destaque" description="Estado operacional, área e atalhos para sensores e reporte de ocorrências.">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {spaces.map((space) => (
                    <SpaceCard key={space.id} space={space} />
                    ))}
                </div>
            </SectionLayout>
            <Footer />
        </div>

    )
}