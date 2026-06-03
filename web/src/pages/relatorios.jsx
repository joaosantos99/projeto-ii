'use client'

import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { FilePlus } from "@phosphor-icons/react"

import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { KpiCards } from "#/components/relatorios/kpi-cards"
import { ReportsTable } from "#/components/relatorios/reports-table"
import { ReportsPagination } from "#/components/relatorios/reports-pagination"
import { GenerateReportDialog } from "#/components/relatorios/generate-report-dialog"
import { REPORTS_PER_PAGE, paginateReports } from "#/data/relatorios"
import { api } from "#/lib/api"

const TYPE_MAP = {
  operational: "operacional",
  environmental: "ambiental",
  incidents: "incidentes",
  incident: "incidentes",
}

const STATUS_MAP = {
  generated: "gerado",
  scheduled: "agendado",
}

function formatDateTime(value) {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  const pad = (n) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function periodLabel(value) {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("pt-PT", { month: "short", year: "numeric" })
}

function normalizeReport(report) {
  return {
    id: report.id,
    type: TYPE_MAP[report.type] ?? report.type,
    scope: report.scope ?? "—",
    period: periodLabel(report.createdAt),
    createdAt: formatDateTime(report.createdAt),
    status: STATUS_MAP[report.status] ?? report.status,
  }
}

export function RelatoriosPage() {
  const { setTitle } = useOutletContext()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [generateOpen, setGenerateOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    setTitle("Relatórios e exportações")
  }, [setTitle])

  useEffect(() => {
    setLoading(true)
    api.get("/reports", { params: { limit: 1000 } })
      .then((res) => setReports((res.data?.data ?? []).map(normalizeReport)))
      .catch(() => setReports([]))
      .finally(() => setLoading(false))
  }, [refresh])

  const totalPages = Math.max(1, Math.ceil(reports.length / REPORTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const paginatedReports = paginateReports(reports, currentPage)

  const handleGenerate = (payload) => {
    return api.post("/reports/generate", payload).then(() => {
      setPage(1)
      setGenerateOpen(false)
      setRefresh((n) => n + 1)
    })
  }

  const handleExport = (reportId) => {
    api.get(`/reports/${reportId}/export`)
      .then((res) => {
        const url = res.data?.url
        if (url) window.open(url, "_blank", "noopener")
      })
      .catch(() => {})
  }

  return (
    <div className="flex flex-col gap-6">
      <KpiCards reports={reports} />

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Geração e histórico</CardTitle>
            <CardDescription>
              Histórico de relatórios gerados e agendados; exporte por linha.
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => setGenerateOpen(true)}>
            <FilePlus />
            Gerar relatório
          </Button>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">A carregar…</p>
          ) : (
            <>
              <ReportsTable reports={paginatedReports} onExport={handleExport} />
              <div className="border-t" />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  {reports.length} relatório(s) — página {currentPage} de {totalPages}
                </p>
                <ReportsPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <GenerateReportDialog
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        onGenerate={handleGenerate}
      />
    </div>
  )
}
