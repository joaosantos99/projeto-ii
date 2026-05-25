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

  const gridTemplate = `minmax(0,1fr) repeat(${actions.length}, minmax(0,88px))`

  return (
    <div className="flex flex-col gap-3">
      <div
        className="grid items-center gap-2 text-xs font-medium uppercase text-muted-foreground"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        <span>Recurso</span>
        {actions.map((action) => (
          <span key={action} className="text-center">
            {labelForAction(action)}
          </span>
        ))}
      </div>
      <div className="h-px bg-border" />
      <div className="flex flex-col">
        {resources.map(([resource, actionsMap]) => (
          <div
            key={resource}
            className="grid items-center gap-2 border-b py-2 last:border-b-0"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            <p className="truncate text-xs font-medium">
              {labelForResource(resource)}
            </p>
            {actions.map((action) => {
              const permId = actionsMap.get(action)
              if (!permId) {
                return (
                  <span
                    key={action}
                    className="text-center text-muted-foreground/40"
                  >
                    —
                  </span>
                )
              }
              const checked = enabledSet.has(permId)
              return (
                <div key={action} className="flex justify-center">
                  <input
                    type="checkbox"
                    aria-label={`${labelForResource(resource)} - ${labelForAction(action)}`}
                    checked={checked}
                    disabled={disabled}
                    onChange={() => onToggle(permId)}
                    className="size-4 rounded-none border border-input accent-primary disabled:opacity-50"
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
