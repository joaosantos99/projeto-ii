'use client'

import { Link } from "react-router-dom"
import { Eye } from "@phosphor-icons/react"
import { Button } from "#/components/ui/button"
import { RoleBadge } from "#/components/utilizadores/role-badge"
import { StatusBadge } from "#/components/utilizadores/status-badge"

export function UsersTable({ users, roleOptions }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="pb-2 pr-4 font-medium">Utilizador</th>
            <th className="pb-2 pr-4 font-medium">Role</th>
            <th className="pb-2 pr-4 font-medium">Estado</th>
            <th className="pb-2 pr-4 font-medium">Último acesso</th>
            <th className="pb-2 text-right font-medium">
              <span className="sr-only">Ver detalhe</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-border last:border-0">
              <td className="py-2.5 pr-4">
                <div className="flex flex-col gap-0.5">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </td>
              <td className="py-2.5 pr-4">
                <RoleBadge role={user.role} roleOptions={roleOptions} />
              </td>
              <td className="py-2.5 pr-4">
                <StatusBadge status={user.status} />
              </td>
              <td className="py-2.5 pr-4 tabular-nums text-muted-foreground">
                {user.lastAccess}
              </td>
              <td className="py-2.5 text-right">
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