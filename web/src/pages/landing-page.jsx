import { Navbar } from "#/components/navbar"
import { Button } from '#/components/ui/button'
import { SectionLayout } from "#/components/landing-layout"
import { SpaceCard } from "#/components/widgets/space-card"
import { MapWidget } from "#/components/widgets/map-widget"
import { Footer } from "#/components/footer"

const spaces = [
  { id: 1, name: "Parque Florestal de Monsanto", parish: "Coimbra", status: "Normal", latitude: 38.7, longitude: -9.1,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
  { id: 2, name: "Parque da Devesa", parish: "Lisboa", status: "Normal", latitude: 41.5, longitude: -8.4,
    image: "https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=400" },
  { id: 3, name: "Parque da Devesa", parish: "Porto", status: "Atenção", latitude: 41.1, longitude: -8.6,
    image: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=400" },
  { id: 4, name: "Parque da Devesa", parish: "Coimbra", status: "Crítico", latitude: 40.2, longitude: -8.4,
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=400" },
]

export function LandingPage() {
    return (
        <div>
            <Navbar />
            <div className="flex items-center px-12 py-24 bg-gradient-to-b from-[#BCE3C3] via-[#BCE3C3] via-35% to-[#E2F9E2]">
                <div className="flex flex-col gap-8 max-w-110">
                    <h3 className="font-landing italic text-4xl">Portal de monitorização de <span className="text-primary">espaços verdes</span></h3>
                    <p className="">Consultar espaços sensores e ocorrências em tempo real por município</p>
                    <Button className="w-fit">Explorar espaço</Button>
                </div>
            </div>
            <SectionLayout title="Mapa de rede" description="Vista geográfica dos espaços verdes em monitorização">
                <MapWidget spaces={spaces}/>
            </SectionLayout>
            <hr className="border-0 h-px mx-12 my-6 bg-gradient-to-r from-transparent via-black/20 to-transparent" />
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