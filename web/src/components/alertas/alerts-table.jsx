'use client'

import { Button } from "#/components/ui/button"
import { SeverityBadge } from "#/components/alertas/severity-badge"

function formatDateTime(value) {
  if (!value) return "—"
  try {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    return d.toLocaleString("pt-PT", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return value
  }
}

export function AlertsTable({ alerts, onAcknowledge, acknowledgingId }) {
  if (alerts.length === 0) {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center gap-1 border border-dashed p-6 text-center">
        <p className="text-sm font-medium">Nenhum alerta encontrado</p>
        <p className="text-xs text-muted-foreground">
          Ajuste o filtro de severidade para alargar os resultados.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b text-left text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">ID</th>
            <th className="px-3 py-2 font-medium">Mensagem</th>
            <th className="px-3 py-2 font-medium">Sensor</th>
            <th className="px-3 py-2 font-medium">Ocorrência</th>
            <th className="px-3 py-2 font-medium">Severidade</th>
            <th className="px-3 py-2 font-medium text-right">Estado</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => {
            const acknowledged = alert.status === "confirmed" || alert.isNotified
            const isBusy = acknowledgingId === alert.id
            return (
              <tr key={alert.id} className="border-b last:border-b-0">
                <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                  {alert.id.slice(0, 8)}
                </td>
                <td className="px-3 py-2 font-medium">{alert.message}</td>
                <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                  {alert.sensorId?.slice(0, 8) ?? "—"}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                  {formatDateTime(alert.createdAt)}
                </td>
                <td className="px-3 py-2">
                  <SeverityBadge severity={alert.severity} />
                </td>
                <td className="px-3 py-2 text-right">
                  <Button
                    size="sm"
                    variant={acknowledged ? "outline" : "secondary"}
                    disabled={acknowledged || isBusy}
                    onClick={() => onAcknowledge(alert.id)}
                  >
                    {acknowledged
                      ? "Reconhecido"
                      : isBusy
                      ? "A reconhecer..."
                      : "Reconhecer"}
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
