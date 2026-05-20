'use client'

import { useEffect, useState } from "react"
import { Button } from "#/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import { selectClass } from "#/data/manutencao"
import {
  SENSOR_TYPE_OPTIONS,
  sensorStatusOptions,
} from "#/data/espacos"

export function AddSensorDialog({ open, spaceName, zones, onClose, onSubmit }) {
  const [zone, setZone] = useState("")
  const [type, setType] = useState(SENSOR_TYPE_OPTIONS[0])
  const [battery, setBattery] = useState("100")
  const [status, setStatus] = useState("online")

  useEffect(() => {
    if (open) {
      setZone(zones[0]?.name ?? "")
      setType(SENSOR_TYPE_OPTIONS[0])
      setBattery("100")
      setStatus("online")
    }
  }, [open, zones])

  if (!open) return null

  const handleSubmit = () => {
    if (!zone) return
    const parsed = Number.parseInt(battery, 10)
    const clamped = Math.max(0, Math.min(100, Number.isNaN(parsed) ? 0 : parsed))
    onSubmit({ zone, type, battery: clamped, status })
  }

  const noZones = zones.length === 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-background ring-1 ring-foreground/10 p-5 flex flex-col gap-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold">Adicionar sensor</h2>
          <p className="text-xs text-muted-foreground">
            Novo sensor em {spaceName}. O ID é gerado automaticamente; a última
            leitura reflete a data atual.
          </p>
        </div>
        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel htmlFor="sensor-zone">Zona</FieldLabel>
            <select
              id="sensor-zone"
              className={selectClass}
              value={zone}
              onChange={(event) => setZone(event.target.value)}
              disabled={noZones}
            >
              {noZones ? (
                <option value="">Adicione uma zona primeiro</option>
              ) : (
                zones.map((z) => (
                  <option key={z.id} value={z.name}>
                    {z.name}
                  </option>
                ))
              )}
            </select>
          </Field>
          <Field>
            <FieldLabel htmlFor="sensor-type">Tipo</FieldLabel>
            <select
              id="sensor-type"
              className={selectClass}
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              {SENSOR_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="sensor-battery">Bateria (%)</FieldLabel>
              <Input
                id="sensor-battery"
                inputMode="numeric"
                value={battery}
                onChange={(event) => setBattery(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="sensor-status">Estado inicial</FieldLabel>
              <select
                id="sensor-status"
                className={selectClass}
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                {sensorStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </FieldGroup>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={noZones || !zone}>
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  )
}