'use client'

import { CalendarCheck, UserCheck, UserMinus, Users } from "@phosphor-icons/react"
import { KpiCard, KpiCardGrid } from "#/components/ui/kpi-card"

export function KpiCards({ summary }) {
  const {
    total = 0,
    active = 0,
    suspended = 0,
    accessToday = 0,
    adminCount = 0,
  } = summary ?? {}

  return (
    <KpiCardGrid>
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
        hint="A aguardar reativação manual"
      />
      <KpiCard
        label="Acessos hoje"
        value={accessToday}
        icon={<CalendarCheck className="size-4 text-muted-foreground" aria-hidden />}
        hint={`${adminCount} com perfil admin`}
      />
    </KpiCardGrid>
  )
}
