export const maintenanceTasksSeed = [
  {
    id: "MT-1201",
    title: "Inspeção de aspersores - Zona Norte",
    zone: "Zona Norte",
    technician: "Rui Almeida",
    priority: "warning",
    dueDate: "2026-03-22",
    status: "pendente",
  },
  {
    id: "MT-1202",
    title: "Reparação de fuga na conduta principal",
    zone: "Zona Sul",
    technician: "Sofia Lopes",
    priority: "critical",
    dueDate: "2026-03-20",
    status: "em_execucao",
  },
  {
    id: "MT-1203",
    title: "Substituição de filtro de rega gota-a-gota",
    zone: "Entrada Principal",
    technician: "Miguel Costa",
    priority: "normal",
    dueDate: "2026-03-28",
    status: "pendente",
  },
  {
    id: "MT-1204",
    title: "Calibração de sensores de humidade",
    zone: "Zona Norte",
    technician: "Ana Ribeiro",
    priority: "normal",
    dueDate: "2026-03-30",
    status: "em_execucao",
  },
  {
    id: "MT-1205",
    title: "Poda de manutenção - relvado central",
    zone: "Zona Sul",
    technician: "Pedro Santos",
    priority: "normal",
    dueDate: "2026-03-18",
    status: "concluida",
  },
]

export const boardColumns = [
  { id: "pendente", title: "Pendentes" },
  { id: "em_execucao", title: "Em execucao" },
  { id: "concluida", title: "Concluidas" },
]

export const selectClass =
  "h-8 w-full min-w-0 rounded-none border border-input bg-transparent px-2.5 py-1 text-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:opacity-50"

export const zoneOptions = ["Zona Norte", "Zona Sul", "Entrada Principal"]

export const priorityOptions = [
  { value: "normal", label: "Normal" },
  { value: "warning", label: "Aviso" },
  { value: "critical", label: "Crítico" },
]
