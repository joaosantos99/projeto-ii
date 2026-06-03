'use client'

import { useMemo } from "react"

const resourceLabel = {
  users: "Utilizadores",
  roles: "Roles",
  reports: "Relatórios",
  spaces: "Espaços",
}

const actionLabel = {
  read: "Ver",
  create: "Criar",
  update: "Editar",
  delete: "Apagar",
}

const actionOrder = ["read", "create", "update", "delete"]

function labelForResource(resource) {
  return resourceLabel[resource] ?? resource
}

function labelForAction(action) {
  return actionLabel[action] ?? action
}

export function PermissionsMatrix({ catalog, enabled, onToggle, disabled }) {
  const { resources, actions } = useMemo(() => {
    const resourceSet = new Map()
    const actionSet = new Set()
    for (const perm of catalog) {
      if (!resourceSet.has(perm.resource)) {
        resourceSet.set(perm.resource, new Map())
      }
      resourceSet.get(perm.resource).set(perm.action, perm.id)
      actionSet.add(perm.action)
    }
    const actionsOrdered = actionOrder.filter((a) => actionSet.has(a))
    for (const a of actionSet) {
      if (!actionsOrdered.includes(a)) actionsOrdered.push(a)
    }
    return {
      resources: Array.from(resourceSet.entries()),
      actions: actionsOrdered,
    }
  }, [catalog])

  const enabledSet = useMemo(() => new Set(enabled), [enabled])

  if (resources.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Sem permissões disponíveis.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="pb-2 pr-4 font-medium">Recurso</th>
            {actions.map((action) => (
              <th key={action} className="pb-2 pr-4 font-medium text-center">
                {labelForAction(action)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resources.map(([resource, actionsMap]) => (
            <tr key={resource} className="border-b border-border last:border-0">
              <td className="py-2.5 pr-4">
                <p className="truncate text-xs font-medium">
                  {labelForResource(resource)}
                </p>
              </td>
              {actions.map((action) => {
                const permId = actionsMap.get(action)
                if (!permId) {
                  return (
                    <td key={action} className="py-2.5 pr-4 text-center text-muted-foreground/40">
                      —
                    </td>
                  )
                }
                const checked = enabledSet.has(permId)
                return (
                  <td key={action} className="py-2.5 pr-4 text-center">
                    <input
                      type="checkbox"
                      aria-label={`${labelForResource(resource)} - ${labelForAction(action)}`}
                      checked={checked}
                      disabled={disabled}
                      onChange={() => onToggle(permId)}
                      className="size-4 rounded-none border border-input accent-primary disabled:opacity-50"
                    />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
