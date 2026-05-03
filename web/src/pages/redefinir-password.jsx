import { useSearchParams } from "react-router-dom"

import { AuthLayout } from "#/components/auth-layout"
import { ResetPasswordForm } from "#/components/reset-password-form"
import { ResetPasswordInvalidCard } from "#/components/reset-password-invalid-card"

export function RedefinirPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")?.trim() || null

  return (
    <AuthLayout>
      {token ? <ResetPasswordForm token={token} /> : <ResetPasswordInvalidCard />}
    </AuthLayout>
  )
}
