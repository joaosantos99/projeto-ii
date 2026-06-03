'use client'

import { Badge } from "#/components/ui/badge"

export function StatusBadge({ status }) {
  return (
    <Badge variant={status === "suspenso" ? "destructive" : "secondary"}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : status}
    </Badge>
  )
}