import { useEffect, useState } from "react"
import { Navbar } from "#/components/navbar"
import { Button } from '#/components/ui/button'
import { SectionLayout } from "#/components/landing-layout"
import { SpaceCard } from "#/components/widgets/space-card"
import { MapWidget } from "#/components/widgets/map-widget"
import { Footer } from "#/components/footer"
import { api } from "#/lib/api"

function normalizeSpaces(list) {
  return list.map((s) => ({
    ...s,
    image: s.imageUrl,
  }))
}

export function LandingPage() {
  const [spaces, setSpaces] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)

  const perPage = 6

  useEffect(() => {
    api.get("/spaces", { params: { page: 1, perPage, readings: true } })
      .then((res) => {
        const list = res.data?.spaces ?? []
        const pagination = res.data?.pagination
        setSpaces(normalizeSpaces(list))
        setHasMore(pagination ? 1 < pagination.totalPages : false)
      })
      .catch(() => setSpaces([]))
      .finally(() => setLoading(false))
  }, [])

  const handleLoadMore = () => {
    const next = page + 1
    setLoadingMore(true)
    api.get("/spaces", { params: { page: next, perPage, readings: true } })
      .then((res) => {
        const list = res.data?.spaces ?? []
        const pagination = res.data?.pagination
        setSpaces((prev) => [...prev, ...normalizeSpaces(list)])
        setHasMore(pagination ? next < pagination.totalPages : false)
        setPage(next)
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false))
  }

  return (
    <div className="bg-[#F8F5F0]">
      <Navbar />
      <div className="flex items-center px-12 py-24 bg-gradient-to-b from-[#BCE3C3] via-[#BCE3C3] via-35% to-[#E2F9E2]">
        <div className="flex flex-col gap-8 max-w-110">
          <h3 className="font-landing italic text-4xl">Portal de monitorização de <span className="text-primary">espaços verdes</span></h3>
          <p className="">Consultar espaços sensores e ocorrências em tempo real por município</p>
          <Button className="w-fit">Explorar espaço</Button>
        </div>
      </div>
      <SectionLayout title="Mapa de rede" description="Vista geográfica dos espaços verdes em monitorização">
        <MapWidget spaces={spaces} />
      </SectionLayout>
      <hr className="border-0 h-px mx-12 my-6 bg-gradient-to-r from-transparent via-black/20 to-transparent" />
      <SectionLayout title="Espaços em destaque" description="Estado operacional, área e atalhos para sensores e reporte de ocorrências.">
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {spaces.map((space) => (
                <SpaceCard key={space.id} space={space} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? "A carregar..." : "Carregar mais"}
                </Button>
              </div>
            )}
          </>
        )}
      </SectionLayout>
      <Footer />
    </div>
  )
}