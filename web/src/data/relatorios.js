export const REPORTS_PER_PAGE = 5

export const typeLabels = {
  operacional: "Operacional",
  ambiental: "Ambiental",
  incidentes: "Incidentes",
}

export const statusLabels = {
  gerado: "Gerado",
  agendado: "Agendado",
}

export const typeOptions = [
  { value: "operacional", label: "Operacional" },
  { value: "ambiental", label: "Ambiental" },
  { value: "incidentes", label: "Incidentes" },
]

export const reportsSeed = [
  {
    id: "REP-330",
    type: "operacional",
    scope: "Municipio de Lisboa",
    period: "Mar 2026",
    createdAt: "2026-03-22 16:30",
    status: "gerado",
  },
  {
    id: "REP-329",
    type: "ambiental",
    scope: "Zona Norte",
    period: "Semana 12",
    createdAt: "2026-03-21 09:12",
    status: "gerado",
  },
  {
    id: "REP-327",
    type: "incidentes",
    scope: "Todos os espacos",
    period: "Ultimos 7 dias",
    createdAt: "2026-03-20 18:02",
    status: "agendado",
  },
]

export function paginateReports(reports, page) {
  const start = (page - 1) * REPORTS_PER_PAGE
  return reports.slice(start, start + REPORTS_PER_PAGE)
}
