'use client'

import { useEffect, useRef, useState } from "react"
import { Image as ImageIcon, UploadSimple, X } from "@phosphor-icons/react"

import { Button } from "#/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"

const emptyForm = {
  name: "",
  city: "",
  postalCode: "",
  latitude: "40.2",
  longitude: "-8.4",
}

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif"

export function SpaceFormDialog({ open, mode, initial, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setForm(initial ?? emptyForm)
      setImage(null)
      setPreview(null)
    }
  }, [open, initial])

  // Revoke the object URL when the preview changes or the dialog unmounts.
  useEffect(() => {
    if (!preview) return undefined
    return () => URL.revokeObjectURL(preview)
  }, [preview])

  if (!open) return null

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSelectImage = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const clearImage = () => {
    setImage(null)
    setPreview(null)
  }

  const handleSubmit = () => {
    if (!form.name.trim() || !form.city.trim()) return
    const latitude = Number.parseFloat(String(form.latitude).replace(",", "."))
    const longitude = Number.parseFloat(String(form.longitude).replace(",", "."))
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return
    onSubmit({
      name: form.name.trim(),
      city: form.city.trim(),
      postalCode: form.postalCode.trim() || "0000-000",
      latitude,
      longitude,
      image,
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
            <Input id="esp-city" value={form.city} onChange={update("city")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="esp-postal">Código postal</FieldLabel>
            <Input id="esp-postal" value={form.postalCode} onChange={update("postalCode")} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="esp-lat">Latitude</FieldLabel>
              <Input id="esp-lat" inputMode="decimal" value={form.latitude} onChange={update("latitude")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="esp-lng">Longitude</FieldLabel>
              <Input id="esp-lng" inputMode="decimal" value={form.longitude} onChange={update("longitude")} />
            </Field>
          </div>
          <Field>
            <FieldLabel>Imagem</FieldLabel>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              className="hidden"
              onChange={handleSelectImage}
            />
            {preview ? (
              <div className="relative size-full overflow-hidden rounded-md border">
                <img
                  src={preview}
                  alt="Pré-visualização"
                  className="h-32 w-full object-cover"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-2 size-7 bg-background"
                  aria-label="Remover imagem"
                  onClick={clearImage}
                >
                  <X />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex h-32 flex-col items-center justify-center gap-1 rounded-md border border-dashed bg-muted/30 text-center text-muted-foreground transition-colors hover:bg-muted/50"
              >
                <ImageIcon className="size-6" aria-hidden />
                <span className="flex items-center gap-1 text-xs">
                  <UploadSimple className="size-3" />
                  Carregar imagem
                </span>
                <span className="text-[10px]">JPEG, PNG, WebP ou AVIF (máx. 5 MB)</span>
              </button>
            )}
          </Field>
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
