import { useState } from "react"
import { Button } from "#/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import { selectClass } from "#/data/manutencao"
import { roleOptions, statusOptions } from "#/data/utilizadores"

export function CreateUserDialog({ open, onClose, onCreate }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("operador")
  const [status, setStatus] = useState("ativo")

  if (!open) return null

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) return
    onCreate({ name, email, role, status })
    setName("")
    setEmail("")
    setRole("operador")
    setStatus("ativo")
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
          <h2 className="text-sm font-semibold">Criar utilizador</h2>
          <p className="text-xs text-muted-foreground">
            Registe uma nova conta no backoffice.
          </p>
        </div>
        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel htmlFor="new-user-name">Nome completo</FieldLabel>
            <Input
              id="new-user-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex.: Maria Santos"
              autoComplete="name"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="new-user-email">Email</FieldLabel>
            <Input
              id="new-user-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nome@municipio.pt"
              autoComplete="email"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="new-user-role">Perfil</FieldLabel>
            <select
              id="new-user-role"
              className={selectClass}
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field>
            <FieldLabel htmlFor="new-user-status">Estado</FieldLabel>
            <select
              id="new-user-status"
              className={selectClass}
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
