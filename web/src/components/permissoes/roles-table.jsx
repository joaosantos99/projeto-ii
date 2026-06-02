'use client'

import { Link } from "react-router-dom"
import { CaretRight } from "@phosphor-icons/react"
import { Button } from "#/components/ui/button"

export function RolesTable({ roles }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b text-left text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">Role</th>
            <th className="px-3 py-2 font-medium text-right tabular-nums">
              Utilizadores
            </th>
            <th className="px-3 py-2 font-medium text-right tabular-nums">
              Permissões
            </th>
            <th className="w-28 px-3 py-2 text-right">
              <span className="sr-only">Editar role</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id} className="border-b last:border-b-0">
              <td className="px-3 py-2">
                <span className="font-medium">{role.name}</span>
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {role.userCount ?? 0}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {role.permissionsDump?.length ?? 0}
              </td>
              <td className="px-3 py-2 text-right">
                <Button asChild variant="ghost" size="sm" className="gap-1">
                  <Link to={`/admin/roles/${role.id}`}>
                    Editar
                    <CaretRight className="size-3.5 opacity-60" aria-hidden />
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
