'use client'

import { useEffect, useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"

import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { PermissionsMatrix } from "#/components/permissoes/permissions-matrix"
import { api } from "#/lib/api"

export function PermissaoDetalhePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { setTitle, setBreadcrumbs } = useOutletContext()

  const [role, setRole] = useState(null)
  const [catalog, setCatalog] = useState([])
  const [loading, setLoading] = useState(true)
  const [pendingPermission, setPendingPermission] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setTitle(role ? role.name : "Permissões")
    setBreadcrumbs([{ label: "Roles", to: "/admin/roles" }])
    return () => setBreadcrumbs([])
  }, [setTitle, setBreadcrumbs, role])

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    Promise.all([
      api.get("/roles"),
      api.get("/permissions"),
    ])
      .then(([rolesRes, catalogRes]) => {
        const match = (rolesRes.data?.data ?? []).find((r) => r.id === id)
        if (!match) {
          setNotFound(true)
          setRole(null)
        } else {
          setRole(match)
        }
        setCatalog(catalogRes.data?.data ?? [])
      })
      .catch(() => {
        setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleToggle = (permissionId) => {
    if (!role || pendingPermission) return
    const current = role.permissionsDump ?? []
    const enabling = !current.includes(permissionId)
    const next = enabling
      ? [...current, permissionId]
      : current.filter((p) => p !== permissionId)

    setPendingPermission(permissionId)
    setRole({ ...role, permissionsDump: next })

    const path = `/roles/${role.id}/permissions/${encodeURIComponent(permissionId)}`
    const request = enabling ? api.put(path) : api.delete(path)
    request
      .catch(() => {
        setRole((prev) =>
          prev ? { ...prev, permissionsDump: current } : prev,
        )
      })
      .finally(() => setPendingPermission(null))
  }

  const enabled = role?.permissionsDump ?? []

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Matriz de permissões</CardTitle>
            <CardDescription>
              {role
                ? `Acessos da role ${role.name}. Cada alteração é guardada automaticamente.`
                : "Acessos por recurso. Cada alteração é guardada automaticamente."}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">A carregar...</p>
          ) : notFound || !role ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Role não encontrada. A role que procura já não existe ou não está acessível.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/roles")}
              >
                Voltar às roles
              </Button>
            </div>
          ) : (
            <PermissionsMatrix
              catalog={catalog}
              enabled={enabled}
              onToggle={handleToggle}
              disabled={pendingPermission !== null}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
