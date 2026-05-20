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

export function KpiCards({ summary }) {
  const {
    total = 0,
    active = 0,
    suspended = 0,
    accessToday = 0,
    adminCount = 0,
  } = summary ?? {}

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
        value={active}
        icon={<UserCheck className="size-4 text-muted-foreground" aria-hidden />}
        hint="Com acesso autorizado"
      />
      <KpiCard
        label="Suspensos"
        value={suspended}
        icon={<UserMinus className="size-4 text-muted-foreground" aria-hidden />}
        hint="Aguardar reativação manual"
      />
      <KpiCard
        label="Acessos hoje"
        value={accessToday}
        icon={<CalendarCheck className="size-4 text-muted-foreground" aria-hidden />}
        hint={`${adminCount} com perfil admin`}
      />
    </section>
  )
}