import { Link, useSearchParams } from "react-router-dom"
import { Leaf } from "@phosphor-icons/react"

import { ResetPasswordForm } from "#/components/reset-password-form"
import { ResetPasswordInvalidCard } from "#/components/reset-password-invalid-card"

export function RedefinirPage() {
  const [searchParams] = useSearchParams()
  const raw = searchParams.get("token")
  const token = raw && raw.trim().length > 0 ? raw.trim() : null

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium text-foreground"
        >
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Leaf className="size-4" aria-hidden />
          </div>
          Green Space Portal
        </Link>
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <ResetPasswordInvalidCard />
        )}
      </div>
    </div>
  )
}
