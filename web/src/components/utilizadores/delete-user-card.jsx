import { useState } from "react"
import { Trash } from "@phosphor-icons/react"
import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { ConfirmDialog } from "#/components/utilizadores/confirm-dialog"

export function DeleteUserCard({ userName, onDelete, deleting }) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    onDelete()
    setOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-destructive">
          Zona de perigo
        </CardTitle>
        <CardDescription>
          Eliminar remove permanentemente este utilizador da aplicação.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => setOpen(true)}
        >
          <Trash />
          Eliminar utilizador
        </Button>
      </CardContent>

      <ConfirmDialog
        open={open}
        title="Eliminar utilizador?"
        description={`Confirme se pretende eliminar ${userName}. O registo deixará de estar disponível na lista.`}
        cancelLabel="Cancelar"
        confirmLabel="Eliminar"
        confirmVariant="destructive"
        disabled={deleting}
        onCancel={() => setOpen(false)}
        onConfirm={handleConfirm}
      />
    </Card>
  )
}
