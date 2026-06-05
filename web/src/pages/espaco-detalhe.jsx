'use client'

import { useEffect, useState, useMemo } from "react"
import { useOutletContext, useParams, useNavigate } from "react-router-dom"

import { DetailHeader } from "#/components/espacos/detail-header"
import { DetailTabs } from "#/components/espacos/detail-tabs"
import { SpaceFormDialog } from "#/components/espacos/space-form-dialog"
import { OverviewTab } from "#/components/espacos/overview-tab"
import { ZonesTab } from "#/components/espacos/zones-tab"
import { SensorsTab } from "#/components/espacos/sensors-tab"
import { MaintenanceTab } from "#/components/espacos/maintenance-tab"
import { IncidentsTab } from "#/components/espacos/incidents-tab"
import { FeedbackTab } from "#/components/espacos/feedback-tab"
import { NotFoundCard } from "#/components/espacos/not-found-card"
import { api } from "#/lib/api"

const TABS = [
  { value: "visao", label: "Visão geral" },
  { value: "zonas", label: "Zonas" },
  { value: "sensores", label: "Sensores" },
  { value: "manutencao", label: "Manutenção" },
  { value: "incidentes", label: "Incidentes" },
  { value: "feedback", label: "Feedback" },
]

export function EspacoDetalhePage() {
  const { id, tab } = useParams()
  const navigate = useNavigate()
  const { setTitle, setBreadcrumbs } = useOutletContext()

  const [space, setSpace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const activeTab = useMemo(() => {
    return TABS.some((t) => t.value === tab) ? tab : "visao"
  }, [tab])

  useEffect(() => {
    let cancelled = false
    setSpace(null)
    setMissing(false)
    setLoading(true)
    api.get(`/spaces/${id}`)
      .then((res) => {
        if (!cancelled) setSpace(res.data)
      })
      .catch((err) => {
        if (cancelled) return
        if (err?.response?.status === 404) setMissing(true)
        setSpace(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    setTitle(space ? space.name : "Espaços verdes")
    setBreadcrumbs([{ label: "Espaços verdes", to: "/admin/espacos" }])
    return () => setBreadcrumbs([])
  }, [setTitle, setBreadcrumbs, space])

  const editInitial = space
    ? {
        name: space.name,
        parish: space.parish,
        postalCode: space.postal_code ?? "",
        latitude: space.latitude,
        longitude: space.longitude,
      }
    : null

  const handleEdit = ({ image: _image, postalCode, ...values }) => {
    return api
      .put(`/spaces/${id}`, { ...values, postal_code: postalCode })
      .then((res) => {
        setSpace(res.data)
        setEditOpen(false)
      })
  }

  if (loading) return <p className="text-sm text-muted-foreground">A carregar…</p>
  if (missing || !space) return <NotFoundCard />

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader space={space} onEdit={() => setEditOpen(true)} />

      <DetailTabs tabs={TABS} active={activeTab} onChange={(next) => navigate(`/admin/espacos/${id}/${next}`)} />

      {activeTab === "visao" ? <OverviewTab space={space} /> : null}
      {activeTab === "zonas" ? <ZonesTab spaceId={space.id} spaceName={space.name} /> : null}
      {activeTab === "sensores" ? <SensorsTab spaceId={space.id} spaceName={space.name} /> : null}
      {activeTab === "manutencao" ? <MaintenanceTab spaceId={space.id} /> : null}
      {activeTab === "incidentes" ? <IncidentsTab spaceId={space.id} /> : null}
      {activeTab === "feedback" ? <FeedbackTab /> : null}

      <SpaceFormDialog
        open={editOpen}
        mode="edit"
        initial={editInitial}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEdit}
      />
    </div>
  )
}
