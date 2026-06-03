'use client'

import { useEffect, useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { ShieldPlus } from "@phosphor-icons/react"

import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { CreateRoleDialog } from "#/components/permissoes/create-role-dialog"
import { RolesTable } from "#/components/permissoes/roles-table"
import { api } from "#/lib/api"

export function PermissoesPage() {
  const { setTitle } = useOutletContext()
  const navigate = useNavigate()
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    setTitle("Roles")
  }, [setTitle])

  useEffect(() => {
    setLoading(true)
    api.get("/roles")
      .then((res) => setRoles(res.data))
      .catch(() => setRoles([]))
      .finally(() => setLoading(false))
  }, [refresh])

  const handleCreate = ({ name, description }) => {
    setSaving(true)
    api.post("/roles", { name, description, permissions: [] })
      .then((res) => {
        setCreateOpen(false)
        setRefresh((n) => n + 1)
        navigate(`/admin/roles/${res.data.id}`)
      })
      .catch(() => {})
      .finally(() => setSaving(false))
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Roles</CardTitle>
            <CardDescription>
              As alterações aos acessos são guardadas automaticamente.
            </CardDescription>
          </div>
          <Button
            size="sm"
            className="shrink-0"
            onClick={() => setCreateOpen(true)}
          >
            <ShieldPlus />
            Nova role
          </Button>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">A carregar...</p>
          ) : (
            <RolesTable roles={roles} />
          )}
        </CardContent>
      </Card>

      <CreateRoleDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
        saving={saving}
      />
    </div>
  )
}
