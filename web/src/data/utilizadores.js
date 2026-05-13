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

export const roleTableIds = {
  admin: "ROL-ADM-01",
  operador: "ROL-OPE-01",
  tecnico: "ROL-TEC-01",
  analista: "ROL-ANA-01",
}

export const usersSeed = [
  {
    id: "USR-201",
    name: "Joana Almeida",
    email: "joana.almeida@vilaverde.pt",
    role: "admin",
    status: "ativo",
    lastAccess: "2026-03-23 09:31",
    roleId: "ROL-ADM-01",
    phone: "+351 253 000 201",
    city: "Vila Verde",
    postalCode: "4730-000",
    createdAt: "2025-06-12 10:00",
    updatedAt: "2026-03-22 18:40",
  },
  {
    id: "USR-144",
    name: "Tiago Moreira",
    email: "tiago.moreira@vilaverde.pt",
    role: "operador",
    status: "ativo",
    lastAccess: "2026-03-23 08:55",
    roleId: "ROL-OPE-01",
    phone: "+351 253 000 144",
    city: "Braga",
    postalCode: "4700-223",
    createdAt: "2025-09-01 09:15",
    updatedAt: "2026-03-21 14:22",
  },
  {
    id: "USR-089",
    name: "Marta Pinho",
    email: "marta.pinho@vilaverde.pt",
    role: "tecnico",
    status: "suspenso",
    lastAccess: "2026-03-19 17:22",
    roleId: "ROL-TEC-01",
    phone: "+351 253 000 089",
    city: "Vila Verde",
    postalCode: "4730-120",
    createdAt: "2025-04-20 11:30",
    updatedAt: "2026-03-18 09:00",
  },
  {
    id: "USR-233",
    name: "Rui Cardoso",
    email: "rui.cardoso@vilaverde.pt",
    role: "analista",
    status: "ativo",
    lastAccess: "2026-03-23 10:04",
    roleId: "ROL-ANA-01",
    phone: "+351 253 000 233",
    city: "Guimarães",
    postalCode: "4800-100",
    createdAt: "2025-11-05 08:45",
    updatedAt: "2026-03-23 07:10",
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
      roleId: roleTableIds[role],
      phone: `+351 253 ${(200 + seed).toString().padStart(3, "0")} ${(10 + seed).toString().padStart(3, "0")}`,
      city: seed % 2 === 0 ? "Vila Verde" : "Braga",
      postalCode: `473${seed % 10}-00${seed % 10}`,
      createdAt: `2025-${((seed % 12) + 1).toString().padStart(2, "0")}-10 12:00`,
      updatedAt: `2026-03-${((seed % 20) + 1).toString().padStart(2, "0")} 10:00`,
    }
  }),
]

export function paginateUsers(users, page, perPage = USERS_PER_PAGE) {
  const startIndex = (page - 1) * perPage
  return users.slice(startIndex, startIndex + perPage)
}
