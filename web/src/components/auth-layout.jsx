'use client'

import { Leaf } from "@phosphor-icons/react"
import { publicUrl } from "#/lib/urls"

export function AuthLayout({ children }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a
          href={publicUrl("/")}
          className="flex items-center gap-2 self-center font-medium text-foreground"
        >
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Leaf className="size-4" aria-hidden />
          </div>
          Green Space Portal
        </a>
        {children}
      </div>
    </div>
  )
}