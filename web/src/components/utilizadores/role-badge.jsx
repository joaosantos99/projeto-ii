'use client'

import { Badge } from "#/components/ui/badge"

export function RoleBadge({ role, roleOptions }) {
  const label = roleOptions?.find((o) => o.value === role)?.label ?? role
  return (
    <Badge variant={role === "admin" ? "secondary" : "outline"}>
      {label}
    </Badge>
  )
}