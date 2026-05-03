import { NavLink } from "react-router-dom"
import {
  SquaresFour,
  Warning,
  Clipboard,
  SlidersHorizontal,
  Users,
  ChartBar,
  ShieldCheck,
  Leaf,
  CaretUpDown,
} from "@phosphor-icons/react"

const navItems = [
  { title: "Visão geral", to: "/dashboard", icon: SquaresFour },
  { title: "Alertas", to: "/dashboard/alertas", icon: Warning },
  { title: "Manutenção", to: "/dashboard/manutencao", icon: Clipboard },
  { title: "Sensores", to: "/dashboard/sensores", icon: SlidersHorizontal },
  { title: "Utilizadores", to: "/dashboard/utilizadores", icon: Users },
  { title: "Relatorios", to: "/dashboard/relatorios", icon: ChartBar },
  { title: "Roles", to: "/dashboard/roles", icon: ShieldCheck },
]

const user = {
  name: "Paulo Portas",
  email: "paulo@vilaverde.pt",
  initials: "PP",
}

export function AppSidebar() {
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
                end={to === "/dashboard"}
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
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-sidebar-accent/50 transition-colors"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
            {user.initials}
          </div>
          <div className="flex flex-1 flex-col text-left leading-tight min-w-0">
            <span className="truncate text-sm font-medium text-sidebar-foreground">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
          </div>
          <CaretUpDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </div>
    </aside>
  )
}
