import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { Menu, Shield, X } from "lucide-react"
import AppSidebar from "./AppSidebar"
import { Button } from "@/components/ui/button"
import { MonitoringProvider } from "@/context/MonitoringContext"

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  return (
    <MonitoringProvider>
      <div className="min-h-screen bg-white lg:pl-64">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Chiudi menu di navigazione"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <AppSidebar
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
        onClose={() => setMobileOpen(false)}
      />

      <div className="flex min-h-screen min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-white px-4 py-3 lg:hidden">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
            aria-expanded={mobileOpen}
            aria-controls="app-sidebar"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="size-4" />
            </div>
            <span className="font-semibold text-foreground">BioSafe Clinic</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-4 py-4 sm:px-6 sm:py-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
      </div>
    </MonitoringProvider>
  )
}
