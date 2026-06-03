'use client'

import { useEffect, useState } from "react"
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom"

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
      api.get("/roles/permissions/catalog"),
    ])
      .then(([rolesRes, catalogRes]) => {
        const match = rolesRes.data.find((r) => r.id === id)
        if (!match) {
          setNotFound(true)
          setRole(null)
        } else {
          setRole(match)
        }
        setCatalog(catalogRes.data)
      })
      .catch(() => {
        setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleToggle = (permissionId) => {
    if (!role || pendingPermission) return
    const current = role.permissionsDump ?? []
    const next = current.includes(permissionId)
      ? current.filter((p) => p !== permissionId)
      : [...current, permissionId]

    setPendingPermission(permissionId)
    setRole({ ...role, permissionsDump: next })

    api.patch(`/roles/${role.id}/permissions`, { permissionId })
      .catch(() => {
        setRole((prev) =>
          prev ? { ...prev, permissionsDump: current } : prev,
        )
      })
      .finally(() => setPendingPermission(null))
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">A carregar...</p>
  }

  if (notFound || !role) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Role não encontrada</CardTitle>
          <CardDescription>
            A role que procura já não existe ou não está acessível.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/roles")}
          >
            Voltar às roles
          </Button>
        </CardContent>
      </Card>
    )
  }

  const enabled = role.permissionsDump ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/roles">Voltar às roles</Link>
        </Button>
        <p className="text-muted-foreground text-sm">
          {role.name}{" "}
          <span className="text-muted-foreground/80">·</span>{" "}
          <span className="font-mono text-xs">{role.id}</span>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Matriz de permissões</CardTitle>
          <CardDescription>
            Acessos da role{" "}
            <span className="font-semibold">{role.name}</span>. Cada alteração é
            guardada automaticamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PermissionsMatrix
            catalog={catalog}
            enabled={enabled}
            onToggle={handleToggle}
            disabled={pendingPermission !== null}
          />
        </CardContent>
      </Card>
    </div>
  )
}
