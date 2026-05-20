'use client'

import { AuthLayout } from "#/components/auth-layout"
import { ForgotPasswordForm } from "#/components/forgot-password-form"

export function RecuperarPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  )
}