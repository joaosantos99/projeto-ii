'use client'

import { MagnifyingGlass } from "@phosphor-icons/react"

export function EmptyState() {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-none border border-dashed p-6 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <MagnifyingGlass className="size-5" aria-hidden />
      </div>
      <p className="text-sm font-medium">Nenhum utilizador encontrado</p>
      <p className="text-xs text-muted-foreground">
        Ajuste a pesquisa ou abra os filtros para alargar os critérios.
      </p>
    </div>
  )
}