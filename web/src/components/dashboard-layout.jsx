import { useState } from "react"
import { Outlet } from "react-router-dom"
import { SidebarSimple } from "@phosphor-icons/react"
import { AppSidebar } from "#/components/app-sidebar"

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [title, setTitle] = useState("")

  return (
    <div className="flex h-svh overflow-hidden bg-background">
      <div
        style={{ width: sidebarOpen ? 240 : 0 }}
        className="shrink-0 overflow-hidden transition-[width] duration-200"
      >
        <AppSidebar />
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <SidebarSimple className="size-4" />
            </button>
            <p className="truncate text-sm font-semibold text-foreground">{title}</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-5 md:px-6">
          <Outlet context={{ setTitle }} />
        </main>
      </div>
    </div>
  )
}
