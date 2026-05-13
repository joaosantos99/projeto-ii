import { Button } from "#/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field"
import { selectClass } from "#/data/manutencao"
import { roleOptions, statusOptions } from "#/data/utilizadores"

export function FiltersSheet({
  open,
  onClose,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
}) {
  if (!open) return null

  const handleClear = () => {
    onRoleFilterChange("todos")
    onStatusFilterChange("todos")
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50"
      onClick={onClose}
    >
      <aside
        className="flex h-full w-full max-w-sm flex-col bg-background ring-1 ring-foreground/10"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex flex-col gap-1 border-b px-4 py-4">
          <h2 className="text-sm font-semibold">Filtrar utilizadores</h2>
          <p className="text-xs text-muted-foreground">
            Refine a tabela por perfil e estado.
          </p>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="filter-role">Perfil</FieldLabel>
              <select
                id="filter-role"
                className={selectClass}
                value={roleFilter}
                onChange={(event) => onRoleFilterChange(event.target.value)}
              >
                <option value="todos">Todos os perfis</option>
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field>
              <FieldLabel htmlFor="filter-status">Estado</FieldLabel>
              <select
                id="filter-status"
                className={selectClass}
                value={statusFilter}
                onChange={(event) => onStatusFilterChange(event.target.value)}
              >
                <option value="todos">Todos os estados</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </FieldGroup>
        </div>

        <footer className="flex items-center justify-between border-t px-4 py-3">
          <Button variant="ghost" onClick={handleClear}>
            Limpar filtros
          </Button>
          <Button onClick={onClose}>Aplicar filtros</Button>
        </footer>
      </aside>
    </div>
  )
}
