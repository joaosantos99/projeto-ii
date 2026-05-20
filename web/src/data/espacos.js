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

export const spacesSeed = [
  {
    id: "monsanto-central",
    name: "Parque Florestal de Monsanto",
    municipality: "Lisboa",
    district: "Lisboa",
    postalCode: "1250-008",
    lat: 38.7322,
    lng: -9.1838,
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
    zonesCount: 3,
    sensorsCount: 5,
    activeAlerts: 2,
    operationalStatus: "ativo",
  },
]

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
