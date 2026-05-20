'use client'

import { useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { KpisWidget } from "#/components/widgets/kpis-widget"
import { AlertasWidget } from "#/components/widgets/alertas-widget"
import { RegaWidget } from "#/components/widgets/rega-widget"
import { IncidentesWidget } from "#/components/widgets/incidentes-widget"

export function DashboardPage() {
  const { setTitle } = useOutletContext()

  useEffect(() => {
    setTitle("Visão geral")
  }, [setTitle])

  return (
    <div className="flex flex-col gap-4">
      <KpisWidget />
      <AlertasWidget />
      <section className="grid gap-4 xl:grid-cols-2">
        <RegaWidget />
        <IncidentesWidget />
      </section>
    </div>
  )
}