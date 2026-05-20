import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"

import { DetailHeader } from "#/components/utilizadores/detail-header"
import { DetailSummaryCard } from "#/components/utilizadores/detail-summary-card"
import { EditUserForm } from "#/components/utilizadores/edit-user-form"
import { DeleteUserCard } from "#/components/utilizadores/delete-user-card"
import { NotFoundCard } from "#/components/utilizadores/not-found-card"
import { usersSeed } from "#/data/utilizadores"

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
  const { setTitle } = useOutletContext()

  const seededUser = useMemo(() => usersSeed.find((u) => u.id === id), [id])
  const [user, setUser] = useState(seededUser)
  const [form, setForm] = useState(seededUser ? buildFormFromUser(seededUser) : null)

  useEffect(() => {
    const next = usersSeed.find((u) => u.id === id)
    setUser(next)
    setForm(next ? buildFormFromUser(next) : null)
  }, [id])

  useEffect(() => {
    setTitle(user ? `Utilizadores - ${user.name}` : "Utilizadores")
  }, [setTitle, user])

  const handleFieldChange = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  if (!user || !form) {
    return <NotFoundCard />
  }

  const handleSave = () => {
    const trimmedName = form.name.trim()
    const trimmedEmail = form.email.trim()
    if (!trimmedName || !trimmedEmail) return
    setUser((prev) => ({
      ...prev,
      name: trimmedName,
      email: trimmedEmail,
      role: form.role,
    }))
  }

  const handleDelete = () => {
    navigate("/admin/utilizadores")
  }

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader name={user.name} email={user.email} />
      <DetailSummaryCard user={user} />
      <EditUserForm
        userId={user.id}
        values={form}
        onChange={handleFieldChange}
        onSubmit={handleSave}
      />
      <DeleteUserCard userName={user.name} onDelete={handleDelete} />
    </div>
  )
}
