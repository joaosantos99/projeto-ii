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
import { VolumeChart } from "#/components/relatorios/volume-chart"
import { ReportsTable } from "#/components/relatorios/reports-table"
import { ReportsPagination } from "#/components/relatorios/reports-pagination"
import { GenerateReportDialog } from "#/components/relatorios/generate-report-dialog"
import {
  REPORTS_PER_PAGE,
  paginateReports,
  reportsSeed,
} from "#/data/relatorios"

export function RelatoriosPage() {
  const { setTitle } = useOutletContext()
  const [reports, setReports] = useState(reportsSeed)
  const [generateOpen, setGenerateOpen] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setTitle("Relatórios e exportações")
  }, [setTitle])

  const totalPages = Math.max(1, Math.ceil(reports.length / REPORTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const paginatedReports = paginateReports(reports, currentPage)

  const handleGenerate = ({ rangeStart, rangeEnd, type }) => {
    setReports((current) => [
      {
        id: `REP-${331 + current.length}`,
        type,
        scope: "Todos os espacos",
        period: `${rangeStart} a ${rangeEnd}`,
        createdAt: "2026-03-23 11:20",
        status: "agendado",
      },
      ...current,
    ])
    setPage(1)
    setGenerateOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <KpiCards reports={reports} />

      <VolumeChart reports={reports} />

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
          <ReportsTable reports={paginatedReports} />
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
