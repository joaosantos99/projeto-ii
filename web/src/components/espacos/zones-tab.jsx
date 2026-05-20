'use client'

import { useEffect, useState } from "react"
import { Plus, Trash, Tree } from "@phosphor-icons/react"
import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { api } from "#/lib/api"
import { AddZoneDialog } from "#/components/espacos/add-zone-dialog"

function formatDate(value) {
  if (!value) return "—"
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("pt-PT")
}

export function ZonesTab({ spaceId, spaceName }) {
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api.get(`/spaces/${spaceId}/zones`)
      .then((res) => {
        if (!cancelled) setZones(Array.isArray(res.data) ? res.data : [])
      })
      .catch(() => {
        if (!cancelled) setZones([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [spaceId])

  const handleAdd = async ({ name }) => {
    const res = await api.post(`/spaces/${spaceId}/zones`, { name })
    setZones((prev) => [...prev, res.data])
    setAddOpen(false)
  }

  const handleRemove = async (zoneId) => {
    const prev = zones
    setZones((current) => current.filter((z) => z.id !== zoneId))
    try {
      await api.delete(`/spaces/${spaceId}/zones/${zoneId}`)
    } catch {
      setZones(prev)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <Tree />
              Zonas do espaço
            </CardTitle>
            <CardDescription>
              Lista editável — adicione ou remova subdivisões monitorizadas.
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus />
            Adicionar zona
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-6 text-center text-sm text-muted-foreground">A carregar…</p>
          ) : zones.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Ainda sem zonas — use “Adicionar zona” para criar a primeira.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Zona</th>
                    <th className="px-3 py-2 font-medium">Criada</th>
                    <th className="w-16 px-3 py-2 text-right font-medium">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.map((zone) => (
                    <tr key={zone.id} className="border-b last:border-b-0">
                      <td className="px-3 py-2 font-medium">{zone.name}</td>
                      <td className="px-3 py-2 text-muted-foreground tabular-nums">
                        {formatDate(zone.createdAt)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Remover ${zone.name}`}
                          onClick={() => handleRemove(zone.id)}
                        >
                          <Trash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddZoneDialog
        open={addOpen}
        spaceName={spaceName}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
      />
    </>
  )
}
