'use client'

import { useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { ProfileFormCard } from "#/components/conta/profile-form-card"
import { PasswordFormCard } from "#/components/conta/password-form-card"
import { useAuth } from "#/hooks/use-auth"
import { api } from "#/lib/api"

export function ContaPage() {
  const { setTitle } = useOutletContext()
  const { user, updateUser } = useAuth()

  useEffect(() => {
    setTitle("Conta")
  }, [setTitle])

  const handleSaveProfile = ({ name, email }) =>
    api.patch("/auth/me", { fullName: name, email }).then((res) => {
      const data = res.data ?? {}
      updateUser({ fullName: data.fullName ?? name, email: data.email ?? email })
    })

  const handleChangePassword = ({ current, next }) =>
    api.patch("/auth/change-password", {
      currentPassword: current,
      newPassword: next,
    })

  return (
    <div className="flex flex-col gap-6">
      <ProfileFormCard
        key={user?.id ?? "anon"}
        initialName={user?.fullName ?? ""}
        initialEmail={user?.email ?? ""}
        onSave={handleSaveProfile}
      />
      <PasswordFormCard onChangePassword={handleChangePassword} />
    </div>
  )
}
