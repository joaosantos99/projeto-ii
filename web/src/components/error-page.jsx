'use client'

import { Link } from "react-router-dom"
import { Button } from "#/components/ui/button"

export function ErrorPage({ code, title, description, actions }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="font-landing text-7xl font-semibold text-primary tabular-nums">
          {code}
        </span>
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {actions.map(({ to, label, variant = "default" }) => (
          <Button key={to} asChild variant={variant}>
            <Link to={to}>{label}</Link>
          </Button>
        ))}
      </div>
    </main>
  )
}
