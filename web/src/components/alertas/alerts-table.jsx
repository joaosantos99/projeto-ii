'use client'

import { Alarm, CheckCircle } from "@phosphor-icons/react"

import { Button } from "#/components/ui/button"
import { SeverityBadge } from "#/components/alertas/severity-badge"
import { formatDateTime } from "#/lib/format-date"

export function AlertsTable({ alerts, onAcknowledge, acknowledgingId, filterActive }) {
  if (alerts.length === 0) {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center gap-1 border border-dashed p-6 text-center">
        <p className="text-sm font-medium">Nenhum alerta encontrado</p>
        <p className="text-xs text-muted-foreground">
          {filterActive
            ? "Ajuste o filtro de severidade para alargar os resultados."
            : "Ainda não existem alertas registados."}
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="pb-2 pr-4 font-medium">Regra</th>
            <th className="pb-2 pr-4 font-medium">Espaço</th>
            <th className="pb-2 pr-4 font-medium">Severidade</th>
            <th className="pb-2 pr-4 font-medium">Data</th>
            <th className="pb-2 text-right font-medium">Ação</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => {
            const acknowledged = alert.status === "confirmed" || alert.isNotified
            const isBusy = acknowledgingId === alert.id
            return (
              <tr key={alert.id} className="border-b border-border last:border-0">
                <td className="py-2.5 pr-4">{alert.message}</td>
                <td className="py-2.5 pr-4 text-muted-foreground">
                  {alert.greenSpaceName ?? "—"}
                </td>
                <td className="py-2.5 pr-4">
                  <SeverityBadge severity={alert.severity} />
                </td>
                <td className="py-2.5 pr-4 text-muted-foreground">
                  {formatDateTime(alert.createdAt)}
                </td>
                <td className="py-2.5 text-right">
                  <Button
                    size="xs"
                    variant={acknowledged ? "secondary" : "outline"}
                    disabled={acknowledged || isBusy}
                    onClick={() => onAcknowledge(alert.id)}
                    className={acknowledged ? "bg-green-50 text-green-700 ring-1 ring-green-200 hover:bg-green-100" : ""}
                  >
                    {acknowledged ? (
                      <>
                        <CheckCircle className="size-3" />
                        Confirmado
                      </>
                    ) : (
                      <>
                        <Alarm className="size-3" />
                        {isBusy ? "A confirmar..." : "Confirmar"}
                      </>
                    )}
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
