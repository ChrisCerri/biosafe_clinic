import { AlertTriangle, Building2, Clock } from "lucide-react"

export default function AlertSummaryCards({
  activeAlerts,
  lastAlert,
  mostCriticalDepartment,
}) {
  return (
    <section className="grid gap-3 md:grid-cols-3" aria-label="Riepilogo alert">
      <div className="rounded-xl border border-border border-l-4 border-l-amber-600 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Alert attivi</p>
        <p className="mt-1 text-2xl font-bold text-foreground">{activeAlerts}</p>
      </div>

      <div className="rounded-xl border border-border border-l-4 border-l-red-600 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-red-700">Ultimo alert</p>
        {lastAlert ? (
          <>
            <p className="mt-1 font-bold text-foreground">
              {lastAlert.device} · {lastAlert.priority}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700">{lastAlert.message}</p>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-600">
              <Clock className="size-3.5" aria-hidden="true" />
              {lastAlert.detectedAt}
            </div>
          </>
        ) : (
          <p className="mt-1 text-sm font-medium text-slate-700">Nessun alert attivo</p>
        )}
      </div>

      <div className="rounded-xl border border-border border-l-4 border-l-red-600 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
          Reparto più critico
        </p>
        {mostCriticalDepartment ? (
          <>
            <div className="mt-1 flex items-center gap-2">
              <Building2 className="size-4 text-slate-600" aria-hidden="true" />
              <p className="font-bold text-foreground">{mostCriticalDepartment.name}</p>
            </div>
            <p className="mt-2 text-sm font-medium text-slate-700">
              {mostCriticalDepartment.critical} critici · {mostCriticalDepartment.warning} warning ·{" "}
              {mostCriticalDepartment.ok} OK
            </p>
            {mostCriticalDepartment.lastAnomaly && (
              <p className="mt-2 text-xs font-medium text-slate-600">
                {mostCriticalDepartment.lastAnomaly}
              </p>
            )}
          </>
        ) : (
          <p className="mt-1 text-sm font-medium text-slate-700">Tutti i reparti nella norma</p>
        )}
      </div>
    </section>
  )
}
