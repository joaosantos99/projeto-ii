'use client'

import { getInitials } from "#/lib/format-date"

export function DetailHeader({ name, email }) {
  return (
    <div className="flex items-center gap-4 border-b border-border pb-5">
      <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-muted text-base font-semibold text-muted-foreground ring-1 ring-border">
        {getInitials(name)}
      </div>
      <div className="flex min-w-0 flex-col">
        <h1 className="truncate text-2xl font-semibold tracking-tight">{name}</h1>
        <p className="truncate text-sm text-muted-foreground">{email}</p>
      </div>
    </div>
  )
}