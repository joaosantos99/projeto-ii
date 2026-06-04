'use client'

import { NavLink, useNavigate } from "react-router-dom"
import {
  SquaresFour,
  Warning,
  Clipboard,
  SlidersHorizontal,
  Users,
  ShieldCheck,
  Leaf,
  Tree,
  CaretUpDown,
  User,
  SignOut,
} from "@phosphor-icons/react"
import { useAuth } from "#/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "#/components/ui/dropdown-menu"

const navItems = [
  { title: "Visão geral", to: "/admin", icon: SquaresFour },
  { title: "Alertas", to: "/admin/alertas", icon: Warning },
  { title: "Espaços", to: "/admin/espacos", icon: Tree },
  { title: "Manutenção", to: "/admin/manutencao", icon: Clipboard },
  { title: "Sensores", to: "/admin/sensores", icon: SlidersHorizontal },
  { title: "Utilizadores", to: "/admin/utilizadores", icon: Users },
  { title: "Roles", to: "/admin/roles", icon: ShieldCheck },
]

function getInitials(name) {
  if (!name) return "?"
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("")
}

export function AppSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const name = user?.fullName
  const email = user?.email
  const initials = getInitials(user?.fullName)

  return (
    <aside className="flex h-svh w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Leaf weight="fill" className="size-4" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-sidebar-foreground">Vila Verde</span>
          <span className="text-xs text-muted-foreground">Backoffice</span>
        </div>
      </div>

      <nav className="flex-1 px-2 py-2">
        <ul className="flex flex-col gap-0.5">
          {navItems.map(({ title, to, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/admin"}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  ].join(" ")
                }
              >
                <Icon className="size-4 shrink-0" />
                {title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border px-3 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
                {initials}
              </div>
              <div className="flex flex-1 flex-col text-left leading-tight min-w-0">
                <span className="truncate text-sm font-medium">{name}</span>
                <span className="truncate text-xs text-muted-foreground">{email}</span>
              </div>
              <CaretUpDown className="size-4 shrink-0 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 rounded-lg"
            side="right"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
                  {initials}
                </div>
                <div className="flex flex-1 flex-col text-left leading-tight min-w-0">
                  <span className="truncate font-medium">{name}</span>
                  <span className="truncate text-xs text-muted-foreground">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/admin/conta")}>
              <User className="size-4" />
              Conta
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <SignOut className="size-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
