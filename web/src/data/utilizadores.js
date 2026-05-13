export const USERS_PER_PAGE = 10

export const roleLabels = {
  admin: "Admin",
  operador: "Operador",
  tecnico: "Técnico",
  analista: "Analista",
}

export const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "operador", label: "Operador" },
  { value: "tecnico", label: "Técnico" },
  { value: "analista", label: "Analista" },
]

export const statusOptions = [
  { value: "ativo", label: "Ativo" },
  { value: "suspenso", label: "Suspenso" },
]

export const usersSeed = [
  {
    id: "USR-201",
    name: "Joana Almeida",
    email: "joana.almeida@vilaverde.pt",
    role: "admin",
    status: "ativo",
    lastAccess: "2026-03-23 09:31",
  },
  {
    id: "USR-144",
    name: "Tiago Moreira",
    email: "tiago.moreira@vilaverde.pt",
    role: "operador",
    status: "ativo",
    lastAccess: "2026-03-23 08:55",
  },
  {
    id: "USR-089",
    name: "Marta Pinho",
    email: "marta.pinho@vilaverde.pt",
    role: "tecnico",
    status: "suspenso",
    lastAccess: "2026-03-19 17:22",
  },
  {
    id: "USR-233",
    name: "Rui Cardoso",
    email: "rui.cardoso@vilaverde.pt",
    role: "analista",
    status: "ativo",
    lastAccess: "2026-03-23 10:04",
  },
  ...Array.from({ length: 18 }, (_, index) => {
    const seed = index + 1
    const roleOrder = ["operador", "tecnico", "analista", "admin"]
    const role = roleOrder[index % roleOrder.length]
    const day = (seed % 23) + 1
    const hour = (8 + (seed % 10)).toString().padStart(2, "0")
    const minute = ((seed * 7) % 60).toString().padStart(2, "0")
    return {
      id: `USR-${300 + seed}`,
      name: `Utilizador Mock ${seed.toString().padStart(2, "0")}`,
      email: `utilizador.mock${seed.toString().padStart(2, "0")}@vilaverde.pt`,
      role,
      status: index % 7 === 0 ? "suspenso" : "ativo",
      lastAccess: `2026-03-${day.toString().padStart(2, "0")} ${hour}:${minute}`,
    }
  }),
]

export function paginateUsers(users, page, perPage = USERS_PER_PAGE) {
  const startIndex = (page - 1) * perPage
  return users.slice(startIndex, startIndex + perPage)
}
