import { AlertOctagon, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import DeviceCard from "@/components/dashboard/DeviceCard"
import AnomalyTimeline from "@/components/dashboard/AnomalyTimeline"
import DeviceTiming from "@/components/dashboard/DeviceTiming"
import KpiGrid from "@/components/dashboard/KpiGrid"
import AlertSummaryCards from "@/components/dashboard/AlertSummaryCards"
import ParameterReadings from "@/components/dashboard/ParameterReadings"
import { useMonitoring } from "@/context/MonitoringContext"
import { DATA_SOURCE_LABEL, getDatasetMeta } from "@/lib/clinicData"

const headerIcons = {
  OK: { icon: CheckCircle2, className: "text-emerald-700" },
  ATTENZIONE: { icon: AlertTriangle, className: "text-amber-700" },
  CRITICO: { icon: ShieldAlert, className: "text-red-700" },
}

function WarningRow({ device }) {
  return (
    <div className="rounded-xl border border-border border-l-4 border-l-amber-600 bg-white px-4 py-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-semibold text-foreground">{device.id}</span>
          <span className="text-sm font-medium text-slate-700">{device.typeLabel}</span>
        </div>
        <p className="mt-1 text-sm font-medium text-foreground">{device.problem}</p>
      </div>

      <div className="mt-3">
        <ParameterReadings alerts={device.alerts} compact />
      </div>

      <div className="mt-3">
        <DeviceTiming
          detectedAt={device.updatedAt}
          timeToCritical={device.timeToCritical}
          variant="warning"
        />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const {
    clinicStatus,
    counts,
    activeCritical,
    activeWarnings,
    anomalyTimeline,
    lastAlert,
    mostCriticalDepartment,
  } = useMonitoring()

  const recentAnomalies = anomalyTimeline.slice(0, 4)
  const statusIcon = headerIcons[clinicStatus.level] ?? headerIcons.CRITICO
  const HeaderIcon = statusIcon.icon
  const meta = getDatasetMeta()

  return (
    <div className="space-y-6 pb-6 sm:space-y-8 sm:pb-8">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div>
          <div className="flex items-start gap-2">
            <HeaderIcon
              className={cn("mt-0.5 size-5 shrink-0", statusIcon.className)}
              aria-hidden="true"
            />
            <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              {clinicStatus.label}
            </h1>
          </div>
          <p className="mt-2 max-w-xl text-sm font-medium text-slate-700">{clinicStatus.summary}</p>
          <p className="mt-1 text-xs font-medium text-slate-600">
            {meta.devices} dispositivi · letture da {DATA_SOURCE_LABEL.toLowerCase()}
          </p>
        </div>
        <p className="text-sm font-medium text-slate-600 sm:pt-1">
          Aggiornato: {clinicStatus.updatedAt}
        </p>
      </header>

      <KpiGrid counts={counts} />

      <AlertSummaryCards
        activeAlerts={counts.activeAlerts}
        lastAlert={lastAlert}
        mostCriticalDepartment={mostCriticalDepartment}
      />

      {activeCritical.length > 0 && (
        <section className="space-y-3" aria-labelledby="critical-heading">
          <h2
            id="critical-heading"
            className="flex items-center gap-2 text-base font-bold text-red-800 sm:text-lg"
          >
            <AlertOctagon className="size-4 shrink-0" aria-hidden="true" />
            Intervento immediato
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {activeCritical.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <section className="space-y-3" aria-labelledby="warning-heading">
          <h2
            id="warning-heading"
            className="flex items-center gap-2 text-base font-bold text-amber-900 sm:text-lg"
          >
            <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
            Warning attivi
          </h2>
          {activeWarnings.length > 0 ? (
            <div className="space-y-2">
              {activeWarnings.map((device) => (
                <WarningRow key={device.id} device={device} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-border bg-white px-4 py-6 text-sm font-medium text-slate-700">
              Nessun warning attivo al momento.
            </p>
          )}
        </section>

        <AnomalyTimeline events={recentAnomalies} />
      </div>
    </div>
  )
}
