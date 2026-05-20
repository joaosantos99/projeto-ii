import { useEffect, useState } from "react"
import { Button } from "#/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"

const emptyForm = {
  name: "",
  municipality: "",
  postalCode: "",
  district: "",
  lat: "40.2",
  lng: "-8.4",
}

export function SpaceFormDialog({ open, mode, initial, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (open) {
      setForm(initial ?? emptyForm)
    }
  }, [open, initial])

  if (!open) return null

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = () => {
    if (!form.name.trim() || !form.municipality.trim() || !form.district.trim()) return
    const lat = Number.parseFloat(form.lat.replace(",", "."))
    const lng = Number.parseFloat(form.lng.replace(",", "."))
    if (Number.isNaN(lat) || Number.isNaN(lng)) return
    onSubmit({
      name: form.name.trim(),
      municipality: form.municipality.trim(),
      postalCode: form.postalCode.trim() || "0000-000",
      district: form.district.trim(),
      lat,
      lng,
    })
  }

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
          <h2 className="text-sm font-semibold">
            {mode === "create" ? "Novo espaço verde" : "Editar espaço"}
          </h2>
          <p className="text-xs text-muted-foreground">
            Identificação geográfica e localização para o painel público e equipas
            de terreno.
          </p>
        </div>
        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel htmlFor="esp-name">Nome</FieldLabel>
            <Input
              id="esp-name"
              value={form.name}
              onChange={update("name")}
              placeholder="Ex.: Parque da Cidade"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="esp-city">Cidade</FieldLabel>
            <Input id="esp-city" value={form.municipality} onChange={update("municipality")} />
          </Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="esp-postal">Código postal</FieldLabel>
              <Input id="esp-postal" value={form.postalCode} onChange={update("postalCode")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="esp-district">Distrito</FieldLabel>
              <Input id="esp-district" value={form.district} onChange={update("district")} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="esp-lat">Latitude</FieldLabel>
              <Input id="esp-lat" inputMode="decimal" value={form.lat} onChange={update("lat")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="esp-lng">Longitude</FieldLabel>
              <Input id="esp-lng" inputMode="decimal" value={form.lng} onChange={update("lng")} />
            </Field>
          </div>
        </FieldGroup>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Guardar</Button>
        </div>
      </div>
    </div>
  )
}
