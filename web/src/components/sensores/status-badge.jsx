'use client'

import { Badge } from "#/components/ui/badge"
import { sensorStatusLabels, statusBadgeVariant } from "#/data/sensores"

export function SensorStatusBadge({ status }) {
  return (
    <Badge variant={statusBadgeVariant(status)}>
      {sensorStatusLabels[status] ?? status}
    </Badge>
  )
}
