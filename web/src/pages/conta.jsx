'use client'

import { useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { ProfileFormCard } from "#/components/conta/profile-form-card"
import { PasswordFormCard } from "#/components/conta/password-form-card"

export function ContaPage() {
  const { setTitle } = useOutletContext()

  useEffect(() => {
    setTitle("Conta")
  }, [setTitle])

  return (
    <div className="flex flex-col gap-6">
      <ProfileFormCard
        initialName="Paulo Portas"
        initialEmail="paulo@vilaverde.pt"
      />
      <PasswordFormCard />
    </div>
  )
}