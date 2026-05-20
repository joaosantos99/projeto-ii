import { Button } from "#/components/ui/button"

export function DeactivateConfirm({ open, spaceName, onCancel, onConfirm }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md bg-background ring-1 ring-foreground/10 p-5 flex flex-col gap-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold">Desativar espaço?</h2>
          <p className="text-xs text-muted-foreground">
            {spaceName ? `“${spaceName}” ` : "O espaço "}deixa de aparecer como ativo
            nas rotinas operacionais. Pode reativar mais tarde editando o registo.
          </p>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Desativar
          </Button>
        </div>
      </div>
    </div>
  )
}
