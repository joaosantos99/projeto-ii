'use client'

import { useEffect, useState } from "react"
import { Button } from "#/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import { selectClass } from "#/data/manutencao"
import { SENSOR_TYPE_OPTIONS } from "#/data/espacos"

export function AddSensorDialog({ open, spaceName, zones, onClose, onSubmit }) {
  const [zoneId, setZoneId] = useState("")
  const [type, setType] = useState(SENSOR_TYPE_OPTIONS[0])
  const [parameter, setParameter] = useState("")
  const [minValue, setMinValue] = useState("0")
  const [maxValue, setMaxValue] = useState("100")
  const [isActive, setIsActive] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setZoneId(zones[0]?.id ?? "")
      setType(SENSOR_TYPE_OPTIONS[0])
      setParameter("")
      setMinValue("0")
      setMaxValue("100")
      setIsActive(true)
      setSubmitting(false)
    }
  }, [open, zones])

  if (!open) return null

  const handleSubmit = async () => {
    if (!zoneId) return
    const min = Number.parseFloat(minValue)
    const max = Number.parseFloat(maxValue)
    setSubmitting(true)
    try {
      await onSubmit({
        zoneId,
        type,
        parameter: parameter.trim() || type,
        minValue: Number.isNaN(min) ? 0 : min,
        maxValue: Number.isNaN(max) ? 0 : max,
        isActive,
      })
    } finally {
      setSubmitting(false)
    }
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
            Novo sensor em {spaceName}.
          </p>
        </div>
        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel htmlFor="sensor-zone">Zona</FieldLabel>
            <select
              id="sensor-zone"
              className={selectClass}
              value={zoneId}
              onChange={(event) => setZoneId(event.target.value)}
              disabled={noZones}
            >
              {noZones ? (
                <option value="">Adicione uma zona primeiro</option>
              ) : (
                zones.map((z) => (
                  <option key={z.id} value={z.id}>
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
          <Field>
            <FieldLabel htmlFor="sensor-parameter">Parâmetro</FieldLabel>
            <Input
              id="sensor-parameter"
              value={parameter}
              onChange={(event) => setParameter(event.target.value)}
              placeholder="Ex.: humidade_solo"
            />
          </Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="sensor-min">Valor mín.</FieldLabel>
              <Input
                id="sensor-min"
                inputMode="numeric"
                value={minValue}
                onChange={(event) => setMinValue(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="sensor-max">Valor máx.</FieldLabel>
              <Input
                id="sensor-max"
                inputMode="numeric"
                value={maxValue}
                onChange={(event) => setMaxValue(event.target.value)}
              />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="sensor-active">Estado</FieldLabel>
            <select
              id="sensor-active"
              className={selectClass}
              value={isActive ? "true" : "false"}
              onChange={(event) => setIsActive(event.target.value === "true")}
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </Field>
        </FieldGroup>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={noZones || !zoneId || submitting}>
            {submitting ? "A criar…" : "Adicionar"}
          </Button>
        </div>
      </div>
    </div>
  )
}
