'use client'

import { useState } from "react"
import { Outlet, NavLink } from "react-router-dom"
import { Fragment } from "react"
import { SidebarSimple } from "@phosphor-icons/react"
import { AppSidebar } from "#/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "#/components/ui/breadcrumb"

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [title, setTitle] = useState("")
  const [breadcrumbs, setBreadcrumbs] = useState([])

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
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <NavLink to="/admin">Vila Verde</NavLink>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {breadcrumbs.map((crumb, i) => (
                  <Fragment key={i}>
                    <BreadcrumbItem>
                      {crumb.to ? (
                        <BreadcrumbLink asChild>
                          <NavLink to={crumb.to}>{crumb.label}</NavLink>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </Fragment>
                ))}
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-5 md:px-6">
          <Outlet context={{ setTitle, setBreadcrumbs }} />
        </main>
      </div>
    </div>
  )
}