export const ROWS_PER_PAGE = 8

export const operationalStatusOptions = [
  { value: "ativo", label: "Ativo" },
  { value: "em_manutencao", label: "Manutenção" },
  { value: "inativo", label: "Inativo" },
]

export const operationalStatusLabels = {
  ativo: "Ativo",
  em_manutencao: "Manutenção",
  inativo: "Inativo",
}

export const severityLabels = {
  normal: "Normal",
  warning: "Aviso",
  critical: "Crítico",
}

export const sensorStatusLabels = {
  online: "Online",
  degradado: "Degradado",
  offline: "Offline",
}

export const sensorStatusOptions = [
  { value: "online", label: "Online" },
  { value: "degradado", label: "Degradado" },
  { value: "offline", label: "Offline" },
]

export const incidentStateLabels = {
  novo: "Novo",
  em_analise: "Em análise",
  resolvido: "Resolvido",
}

export const incidentStateOptions = [
  { value: "novo", label: "Novo" },
  { value: "em_analise", label: "Em análise" },
  { value: "resolvido", label: "Resolvido" },
]

export const taskStatusLabels = {
  pendente: "Pendente",
  em_execucao: "Em execução",
  concluida: "Concluída",
}

export const SENSOR_TYPE_OPTIONS = [
  "Humidade",
  "Temperatura",
  "CO2",
  "Ruído",
  "Vento",
]

export const spacesSeed = [
  {
    id: "monsanto-central",
    name: "Parque Florestal de Monsanto",
    municipality: "Lisboa",
    district: "Lisboa",
    postalCode: "1250-008",
    lat: 38.7322,
    lng: -9.1838,
    areaHa: 900,
    activeIncidents: 2,
    status: "warning",
    zonesCount: 4,
    sensorsCount: 6,
    activeAlerts: 2,
    operationalStatus: "ativo",
  },
  {
    id: "mata-bucaco",
    name: "Mata Nacional do Bucaco",
    municipality: "Mealhada",
    district: "Aveiro",
    postalCode: "3050-024",
    lat: 40.3771,
    lng: -8.3795,
    areaHa: 105,
    activeIncidents: 1,
    status: "normal",
    zonesCount: 2,
    sensorsCount: 4,
    activeAlerts: 1,
    operationalStatus: "ativo",
  },
  {
    id: "jardim-cristal",
    name: "Jardins do Palácio de Cristal",
    municipality: "Porto",
    district: "Porto",
    postalCode: "4050-123",
    lat: 41.1475,
    lng: -8.6237,
    areaHa: 8,
    activeIncidents: 0,
    status: "normal",
    zonesCount: 2,
    sensorsCount: 3,
    activeAlerts: 0,
    operationalStatus: "em_manutencao",
  },
  {
    id: "quinta-lagrimas",
    name: "Quinta das Lágrimas",
    municipality: "Coimbra",
    district: "Coimbra",
    postalCode: "3041-901",
    lat: 40.1972,
    lng: -8.4232,
    areaHa: 18,
    activeIncidents: 1,
    status: "warning",
    zonesCount: 2,
    sensorsCount: 3,
    activeAlerts: 1,
    operationalStatus: "ativo",
  },
  {
    id: "parque-cidade",
    name: "Parque da Cidade",
    municipality: "Porto",
    district: "Porto",
    postalCode: "4100-121",
    lat: 41.1714,
    lng: -8.6918,
    areaHa: 83,
    activeIncidents: 2,
    status: "critical",
    zonesCount: 3,
    sensorsCount: 5,
    activeAlerts: 2,
    operationalStatus: "ativo",
  },
]

export const zonesBySpaceId = {
  "monsanto-central": [
    { id: "z-m-1", name: "Entrada Principal", description: "Portão norte e estacionamento." },
    { id: "z-m-2", name: "Zona Norte", description: "Trilhos e pinhal." },
    { id: "z-m-3", name: "Zona Sul", description: "Área de piquenique." },
    { id: "z-m-4", name: "Miradouro", description: "Panorâmica sobre o Tejo." },
  ],
  "mata-bucaco": [
    { id: "z-b-1", name: "Setor Oeste", description: "Rega e sensores de solo." },
    { id: "z-b-2", name: "Núcleo central", description: "Visitantes e percursos." },
  ],
  "jardim-cristal": [
    { id: "z-j-1", name: "Palácio", description: "Zona histórica." },
    { id: "z-j-2", name: "Lago", description: "Avifauna e vegetação aquática." },
  ],
  "quinta-lagrimas": [
    { id: "z-q-1", name: "Jardim Botânico", description: "Coleções temáticas." },
    { id: "z-q-2", name: "Hotel", description: "Perímetro e iluminação." },
  ],
  "parque-cidade": [
    { id: "z-p-1", name: "Eixo Central", description: "Corredor principal." },
    { id: "z-p-2", name: "Zona Sul", description: "Lago e relvado." },
    { id: "z-p-3", name: "Zona Desportiva", description: "Pistas e equipamentos." },
  ],
}

export const sensorsBySpaceId = {
  "monsanto-central": [
    { id: "SN-301", zone: "Zona Norte", type: "Humidade", lastReading: "2026-03-23 09:20", battery: 78, status: "online" },
    { id: "SN-302", zone: "Zona Sul", type: "Temperatura", lastReading: "2026-03-23 09:18", battery: 64, status: "online" },
    { id: "SN-303", zone: "Miradouro", type: "Vento", lastReading: "2026-03-23 08:55", battery: 41, status: "degradado" },
  ],
  "mata-bucaco": [
    { id: "SN-310", zone: "Setor Oeste", type: "Humidade", lastReading: "2026-03-23 09:22", battery: 88, status: "online" },
    { id: "SN-311", zone: "Núcleo central", type: "CO2", lastReading: "2026-03-23 09:21", battery: 70, status: "online" },
  ],
  "jardim-cristal": [
    { id: "SN-320", zone: "Lago", type: "Humidade", lastReading: "2026-03-23 09:00", battery: 52, status: "online" },
    { id: "SN-321", zone: "Palácio", type: "Ruído", lastReading: "2026-03-22 22:15", battery: 18, status: "offline" },
  ],
  "quinta-lagrimas": [
    { id: "SN-330", zone: "Jardim Botânico", type: "Humidade", lastReading: "2026-03-23 09:25", battery: 80, status: "online" },
  ],
  "parque-cidade": [
    { id: "SN-340", zone: "Eixo Central", type: "CO2", lastReading: "2026-03-23 09:27", battery: 60, status: "online" },
    { id: "SN-341", zone: "Zona Sul", type: "Ruído", lastReading: "2026-03-23 09:10", battery: 35, status: "degradado" },
  ],
}

export const maintenanceBySpaceId = {
  "monsanto-central": [
    { id: "MT-1204", title: "Substituir bateria sensor humidade", zone: "Zona Norte", technician: "Ana Costa", priority: "warning", dueDate: "2026-03-24", status: "pendente" },
    { id: "MT-1180", title: "Inspeção cabos gateway", zone: "Entrada Principal", technician: "Miguel Pires", priority: "normal", dueDate: "2026-03-18", status: "concluida" },
  ],
  "mata-bucaco": [
    { id: "MT-1194", title: "Reiniciar gateway de telemetria", zone: "Setor Oeste", technician: "Rita Lopes", priority: "critical", dueDate: "2026-03-23", status: "em_execucao" },
  ],
  "jardim-cristal": [],
  "quinta-lagrimas": [
    { id: "MT-1188", title: "Verificar rega automática", zone: "Jardim Botânico", technician: "Pedro Monteiro", priority: "warning", dueDate: "2026-03-26", status: "em_execucao" },
  ],
  "parque-cidade": [
    { id: "MT-1201", title: "Calibração CO2 eixo central", zone: "Eixo Central", technician: "Ana Costa", priority: "critical", dueDate: "2026-03-22", status: "pendente" },
  ],
}

export const incidentsBySpaceId = {
  "monsanto-central": [
    { id: "INC-401", title: "Lixo acumulado junto ao miradouro", zone: "Miradouro", severity: "warning", reportedAt: "2026-03-22 18:45", state: "em_analise" },
    { id: "INC-402", title: "Iluminação avariada no parque infantil", zone: "Zona Sul", severity: "warning", reportedAt: "2026-03-21 21:12", state: "novo" },
  ],
  "mata-bucaco": [
    { id: "INC-410", title: "Ramos caídos no percurso pedonal", zone: "Núcleo central", severity: "normal", reportedAt: "2026-03-20 10:05", state: "resolvido" },
  ],
  "jardim-cristal": [],
  "quinta-lagrimas": [
    { id: "INC-420", title: "Vandalismo em sinalética", zone: "Hotel", severity: "warning", reportedAt: "2026-03-22 23:30", state: "em_analise" },
  ],
  "parque-cidade": [
    { id: "INC-430", title: "Ruído excessivo após hora limite", zone: "Zona Sul", severity: "critical", reportedAt: "2026-03-23 00:15", state: "novo" },
    { id: "INC-431", title: "Fuga de água na zona desportiva", zone: "Zona Desportiva", severity: "warning", reportedAt: "2026-03-22 14:50", state: "em_analise" },
  ],
}

export const feedbackBySpaceId = {
  "monsanto-central": [
    { id: "fb-1", author: "Visitante anónimo", body: "Excelente sinalização nos trilhos. Luzes do miradouro com intermitência.", createdAt: "2026-03-21 16:40" },
    { id: "fb-2", author: "Associação local", body: "Pedimos mais informação sobre horários de rega na zona sul.", createdAt: "2026-03-20 09:12" },
  ],
  "mata-bucaco": [],
  "jardim-cristal": [],
  "quinta-lagrimas": [],
  "parque-cidade": [
    { id: "fb-3", author: "Cidadã", body: "Ruído elevado junto ao relvado ao final da tarde.", createdAt: "2026-03-23 08:05" },
  ],
}

export function slugFromName(name) {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return base || `espaco-${Date.now()}`
}

export function paginateSpaces(rows, page) {
  const start = (page - 1) * ROWS_PER_PAGE
  return rows.slice(start, start + ROWS_PER_PAGE)
}

export function nextSensorId(sensors) {
  let max = 300
  for (const s of sensors) {
    const n = Number.parseInt(s.id.replace(/[^0-9]/g, ""), 10)
    if (!Number.isNaN(n) && n > max) max = n
  }
  return `SN-${max + 1}`
}

export function formatReadingNow() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
