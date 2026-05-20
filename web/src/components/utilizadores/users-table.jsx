'use client'

import { Link } from "react-router-dom"
import { Eye } from "@phosphor-icons/react"
import { Button } from "#/components/ui/button"
import { RoleBadge } from "#/components/utilizadores/role-badge"
import { StatusBadge } from "#/components/utilizadores/status-badge"

export function UsersTable({ users, roleOptions }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b text-left text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">Utilizador</th>
            <th className="px-3 py-2 font-medium">Role</th>
            <th className="px-3 py-2 font-medium">Estado</th>
            <th className="px-3 py-2 font-medium">Último acesso</th>
            <th className="w-12 px-3 py-2 text-right">
              <span className="sr-only">Ver detalhe</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b last:border-b-0">
              <td className="px-3 py-2">
                <div className="flex flex-col gap-0.5">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </td>
              <td className="px-3 py-2">
                <RoleBadge role={user.role} roleOptions={roleOptions} />
              </td>
              <td className="px-3 py-2">
                <StatusBadge status={user.status} />
              </td>
              <td className="px-3 py-2 tabular-nums text-muted-foreground">
                {user.lastAccess}
              </td>
              <td className="px-3 py-2 text-right">
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  aria-label={`Ver ficha de ${user.name}`}
                >
                  <Link to={`/admin/utilizadores/${user.id}`}>
                    <Eye />
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}