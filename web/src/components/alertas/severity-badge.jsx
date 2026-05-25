'use client'

import { Badge } from "#/components/ui/badge"

const SEVERITY_VARIANT = {
  critical: "destructive",
  warning: "warning",
  normal: "secondary",
}

const SEVERITY_LABEL = {
  critical: "Crítico",
  warning: "Aviso",
  normal: "Normal",
}

export function SeverityBadge({ severity }) {
  const variant = SEVERITY_VARIANT[severity] ?? "outline"
  const label = SEVERITY_LABEL[severity] ?? severity ?? "—"
  return <Badge variant={variant}>{label}</Badge>
}
