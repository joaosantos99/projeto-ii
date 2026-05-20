'use client'

import { useEffect, useMemo, useState } from "react"
import { useOutletContext, useParams } from "react-router-dom"

import { DetailHeader } from "#/components/espacos/detail-header"
import { DetailTabs } from "#/components/espacos/detail-tabs"
import { OverviewTab } from "#/components/espacos/overview-tab"
import { ZonesTab } from "#/components/espacos/zones-tab"
import { SensorsTab } from "#/components/espacos/sensors-tab"
import { MaintenanceTab } from "#/components/espacos/maintenance-tab"
import { IncidentsTab } from "#/components/espacos/incidents-tab"
import { FeedbackTab } from "#/components/espacos/feedback-tab"
import { AddZoneDialog } from "#/components/espacos/add-zone-dialog"
import { AddSensorDialog } from "#/components/espacos/add-sensor-dialog"
import { NotFoundCard } from "#/components/espacos/not-found-card"
import {
  feedbackBySpaceId,
  formatReadingNow,
  incidentsBySpaceId,
  maintenanceBySpaceId,
  nextSensorId,
  sensorsBySpaceId,
  spacesSeed,
  zonesBySpaceId,
} from "#/data/espacos"

const TABS = [
  { value: "visao", label: "Visão geral" },
  { value: "zonas", label: "Zonas" },
  { value: "sensores", label: "Sensores" },
  { value: "manutencao", label: "Manutenção" },
  { value: "incidentes", label: "Incidentes" },
  { value: "feedback", label: "Feedback" },
]

export function EspacoDetalhePage() {
  const { id } = useParams()
  const { setTitle } = useOutletContext()

  const space = useMemo(() => spacesSeed.find((s) => s.id === id), [id])

  const [activeTab, setActiveTab] = useState("visao")
  const [zones, setZones] = useState(() => zonesBySpaceId[id] ?? [])
  const [sensors, setSensors] = useState(() => sensorsBySpaceId[id] ?? [])
  const [incidents, setIncidents] = useState(() => incidentsBySpaceId[id] ?? [])
  const [feedback, setFeedback] = useState(() => feedbackBySpaceId[id] ?? [])
  const [addZoneOpen, setAddZoneOpen] = useState(false)
  const [addSensorOpen, setAddSensorOpen] = useState(false)

  const maintenance = maintenanceBySpaceId[id] ?? []

  useEffect(() => {
    setZones(zonesBySpaceId[id] ?? [])
    setSensors(sensorsBySpaceId[id] ?? [])
    setIncidents(incidentsBySpaceId[id] ?? [])
    setFeedback(feedbackBySpaceId[id] ?? [])
    setActiveTab("visao")
  }, [id])

  useEffect(() => {
    setTitle(space ? `Espaços · ${space.name}` : "Espaços verdes")
  }, [setTitle, space])

  if (!space) return <NotFoundCard />

  const handleAddZone = ({ name, description }) => {
    setZones((prev) => [
      ...prev,
      { id: `z-${id}-${Date.now()}`, name, description },
    ])
    setAddZoneOpen(false)
  }

  const handleRemoveZone = (zoneId) => {
    setZones((prev) => prev.filter((z) => z.id !== zoneId))
  }

  const handleAddSensor = ({ zone, type, battery, status }) => {
    setSensors((prev) => [
      ...prev,
      {
        id: nextSensorId(prev),
        zone,
        type,
        battery,
        status,
        lastReading: formatReadingNow(),
      },
    ])
    setAddSensorOpen(false)
  }

  const handleIncidentStateChange = (incidentId, state) => {
    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === incidentId ? { ...incident, state } : incident
      )
    )
  }

  const handleRemoveFeedback = (feedbackId) => {
    setFeedback((prev) => prev.filter((item) => item.id !== feedbackId))
  }

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader space={space} />

      <DetailTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {activeTab === "visao" ? <OverviewTab space={space} /> : null}
      {activeTab === "zonas" ? (
        <ZonesTab
          zones={zones}
          onAdd={() => setAddZoneOpen(true)}
          onRemove={handleRemoveZone}
        />
      ) : null}
      {activeTab === "sensores" ? (
        <SensorsTab
          sensors={sensors}
          hasZones={zones.length > 0}
          onAdd={() => setAddSensorOpen(true)}
        />
      ) : null}
      {activeTab === "manutencao" ? <MaintenanceTab tasks={maintenance} /> : null}
      {activeTab === "incidentes" ? (
        <IncidentsTab
          incidents={incidents}
          onStateChange={handleIncidentStateChange}
        />
      ) : null}
      {activeTab === "feedback" ? (
        <FeedbackTab feedback={feedback} onRemove={handleRemoveFeedback} />
      ) : null}

      <AddZoneDialog
        open={addZoneOpen}
        spaceName={space.name}
        onClose={() => setAddZoneOpen(false)}
        onSubmit={handleAddZone}
      />

      <AddSensorDialog
        open={addSensorOpen}
        spaceName={space.name}
        zones={zones}
        onClose={() => setAddSensorOpen(false)}
        onSubmit={handleAddSensor}
      />
    </div>
  )
}