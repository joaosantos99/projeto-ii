'use client'

import { Link } from "react-router-dom"
import { PencilSimple } from "@phosphor-icons/react"
import { Button } from "#/components/ui/button"

export function RolesTable({ roles }) {
  if (roles.length === 0) {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center gap-1 border border-dashed p-6 text-center">
        <p className="text-sm font-medium">Nenhuma role encontrada</p>
        <p className="text-xs text-muted-foreground">
          Crie a primeira para começar.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="pb-2 pr-4 font-medium">Role</th>
            <th className="pb-2 pr-4 text-right font-medium">Utilizadores</th>
            <th className="pb-2 pr-4 text-right font-medium">Permissões</th>
            <th className="pb-2 text-right font-medium">
              <span className="sr-only">Editar role</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id} className="border-b border-border last:border-0">
              <td className="py-2.5 pr-4">
                <p className="font-medium">{role.name}</p>
              </td>
              <td className="py-2.5 pr-4 text-right tabular-nums">
                {role.userCount ?? 0}
              </td>
              <td className="py-2.5 pr-4 text-right tabular-nums">
                {role.permissionsDump?.length ?? 0}
              </td>
              <td className="py-2.5 text-right">
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  aria-label={`Editar role ${role.name}`}
                >
                  <Link to={`/admin/roles/${role.id}`}>
                    <PencilSimple />
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
