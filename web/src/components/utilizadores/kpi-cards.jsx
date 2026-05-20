'use client'

import { CalendarCheck, UserCheck, UserMinus, Users } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"

function KpiCard({ label, value, icon, hint }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}

export function KpiCards({ users }) {
  const total = users.length
  const activeCount = users.filter((user) => user.status === "ativo").length
  const suspendedCount = users.filter((user) => user.status === "suspenso").length
  const todayAccessCount = users.filter((user) =>
    user.lastAccess.startsWith("2026-03-23")
  ).length
  const adminCount = users.filter((user) => user.role === "admin").length

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Total de utilizadores"
        value={total}
        icon={<Users className="size-4 text-muted-foreground" aria-hidden />}
        hint="Base atual do backoffice"
      />
      <KpiCard
        label="Ativos"
        value={activeCount}
        icon={<UserCheck className="size-4 text-muted-foreground" aria-hidden />}
        hint="Com acesso autorizado"
      />
      <KpiCard
        label="Suspensos"
        value={suspendedCount}
        icon={<UserMinus className="size-4 text-muted-foreground" aria-hidden />}
        hint="Aguardar reativação manual"
      />
      <KpiCard
        label="Acessos hoje"
        value={todayAccessCount}
        icon={<CalendarCheck className="size-4 text-muted-foreground" aria-hidden />}
        hint={`${adminCount} com perfil admin`}
      />
    </section>
  )
}