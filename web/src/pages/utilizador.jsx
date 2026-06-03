'use client'

import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"

import { DetailHeader } from "#/components/utilizadores/detail-header"
import { UserDetailCard } from "#/components/utilizadores/user-detail-card"
import { DeleteUserCard } from "#/components/utilizadores/delete-user-card"
import { NotFoundCard } from "#/components/utilizadores/not-found-card"
import { api } from "#/lib/api"

function buildFormFromUser(user) {
  return {
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

export function UtilizadorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { setTitle, setBreadcrumbs } = useOutletContext()

  const [user, setUser] = useState(null)
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [roles, setRoles] = useState([])

  useEffect(() => {
    api.get("/roles")
      .then((res) => setRoles(res.data))
      .catch(() => setRoles([]))
  }, [])

  useEffect(() => {
    setLoading(true)
    api.get(`/users/${id}`)
      .then((res) => {
        const mapped = {
          id: res.data.id,
          name: res.data.fullName,
          email: res.data.email,
          role: res.data.role,
          createdAt: res.data.createdAt,
        }
        setUser(mapped)
        setForm(buildFormFromUser(mapped))
      })
      .catch(() => {
        setUser(null)
        setForm(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    setTitle(user ? user.name : "Utilizadores")
    setBreadcrumbs([{ label: "Gestão de utilizadores", to: "/admin/utilizadores" }])
    return () => setBreadcrumbs([])
  }, [setTitle, setBreadcrumbs, user])

  const handleFieldChange = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleCancel = useCallback(() => {
    setForm(buildFormFromUser(user))
  }, [user])

  const roleOptions = useMemo(() => {
    return roles.map((r) => ({
      value: r.name,
      label: r.name.charAt(0).toUpperCase() + r.name.slice(1),
    }))
  }, [roles])

  if (loading) {
    return <p className="text-sm text-muted-foreground">A carregar...</p>
  }

  if (!user || !form) {
    return <NotFoundCard />
  }

  const handleSave = () => {
    const trimmedName = form.name.trim()
    const trimmedEmail = form.email.trim()
    if (!trimmedName || !trimmedEmail) return Promise.resolve()
    setSaving(true)
    return api.put(`/users/${id}`, {
      fullName: trimmedName,
      email: trimmedEmail,
      role: form.role,
    })
      .then((res) => {
        const mapped = {
          id: res.data.id,
          name: res.data.fullName,
          email: res.data.email,
          role: res.data.role,
          createdAt: res.data.createdAt,
        }
        setUser(mapped)
        setForm(buildFormFromUser(mapped))
      })
      .finally(() => setSaving(false))
  }

  const handleDelete = () => {
    setDeleting(true)
    api.delete(`/users/${id}`)
      .then(() => navigate("/admin/utilizadores"))
      .catch(() => {})
      .finally(() => setDeleting(false))
  }

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader name={user.name} email={user.email} />
      <UserDetailCard
        user={user}
        roleOptions={roleOptions}
        values={form}
        onChange={handleFieldChange}
        onSave={handleSave}
        onCancel={handleCancel}
        saving={saving}
      />
      <DeleteUserCard userName={user.name} onDelete={handleDelete} deleting={deleting} />
    </div>
  )
}
