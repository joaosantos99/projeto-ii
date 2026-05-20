'use client'

import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"

function DetailField({ label, value, mono }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={mono ? "font-mono text-sm text-foreground" : "text-sm text-foreground"}>
        {value}
      </p>
    </div>
  )
}

export function DetailSummaryCard({ user, roleOptions }) {
  const roleLabel = roleOptions?.find((o) => o.value === user.role)?.label ?? user.role
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Detalhes da conta</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          <DetailField label="ID" value={user.id} mono />
          <DetailField label="Nome completo" value={user.name} />
          <DetailField label="Email" value={user.email} />
          <DetailField label="Role" value={roleLabel} />
        </div>
      </CardContent>
    </Card>
  )
}