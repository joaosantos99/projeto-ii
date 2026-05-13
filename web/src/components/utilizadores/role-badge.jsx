import { Badge } from "#/components/ui/badge"
import { roleLabels } from "#/data/utilizadores"

export function RoleBadge({ role }) {
  return (
    <Badge variant={role === "admin" ? "secondary" : "outline"}>
      {roleLabels[role] ?? role}
    </Badge>
  )
}
