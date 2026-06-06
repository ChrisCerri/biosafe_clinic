import { NavLink } from "react-router-dom"
import {
  Bell,
  Building2,
  FileBarChart,
  History,
  Home,
  Settings,
  Shield,
  User,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { currentUser } from "@/data/currentUser"

const navItems = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/reparti", label: "Reparti", icon: Building2 },
  { to: "/allarmi", label: "Allarmi", icon: Bell },
  { to: "/storico", label: "Storico", icon: History },
  { to: "/report", label: "Report", icon: FileBarChart },
  { to: "/impostazioni", label: "Impostazioni", icon: Settings },
]

export default function AppSidebar({ mobileOpen = false, onNavigate, onClose }) {
  return (
    <aside
      id="app-sidebar"
      aria-label="Menu principale"
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-screen w-72 max-w-[85vw] flex-col bg-sidebar text-sidebar-foreground shadow-xl transition-transform duration-300 ease-in-out lg:w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-sidebar-border px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-white/20">
            <Shield className="size-5" />
          </div>
          <div>
            <p className="font-semibold leading-tight">BioSafe Clinic</p>
            <p className="text-xs text-white/90">Conservazione campioni</p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Chiudi menu"
          className="text-white hover:bg-white/15 hover:text-white lg:hidden"
          onClick={onClose}
        >
          <X className="size-5" />
        </Button>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3" aria-label="Navigazione">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/25 text-white"
                  : "text-white/90 hover:bg-sidebar-accent hover:text-white"
              )
            }
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 border-t border-sidebar-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20">
            <User className="size-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{currentUser.name}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-white/90">4 laboratori monitorati</p>
        <p className="mt-1 text-xs font-semibold text-red-200">Stato: CRITICO</p>
      </div>
    </aside>
  )
}
