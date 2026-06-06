import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react"
import { cn } from "@/lib/utils"
import DeviceCard from "@/components/dashboard/DeviceCard"
import AnomalyTimeline from "@/components/dashboard/AnomalyTimeline"
import DeviceTiming from "@/components/dashboard/DeviceTiming"
import ScenarioSwitcher from "@/components/dashboard/ScenarioSwitcher"
import KpiGrid from "@/components/dashboard/KpiGrid"
import AlertSummaryCards from "@/components/dashboard/AlertSummaryCards"
import TicketModals from "@/components/dashboard/TicketModals"
import TicketActions from "@/components/dashboard/TicketActions"
import TicketStatusBadge from "@/components/dashboard/TicketStatusBadge"
import ClosureCriticalityBadge from "@/components/dashboard/ClosureCriticalityBadge"
import ParameterReadings from "@/components/dashboard/ParameterReadings"
import { useMonitoring } from "@/context/MonitoringContext"
import { SCENARIO_IDS } from "@/data/dashboardScenarios"
import { TICKET_STATUS } from "@/lib/ticketStatus"

const headerIcons = {
  [SCENARIO_IDS.NONE]: { icon: CheckCircle2, className: "text-emerald-700" },
  [SCENARIO_IDS.MEDIUM]: { icon: AlertTriangle, className: "text-amber-700" },
  [SCENARIO_IDS.HIGH]: { icon: ShieldAlert, className: "text-red-700" },
}

function WarningRow({ device, ticketStatus, onTakeCharge, onClose }) {
  const isClosed = ticketStatus === TICKET_STATUS.CLOSED

  return (
    <div
      className={cn(
        "rounded-xl border border-border border-l-4 border-l-amber-600 bg-white px-4 py-3",
        isClosed && "opacity-75"
      )}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-semibold text-foreground">{device.id}</span>
          <span className="text-sm font-medium text-slate-700">{device.typeLabel}</span>
          <TicketStatusBadge status={ticketStatus} />
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

      <div className="mt-3 border-t border-border pt-3">
        <TicketActions status={ticketStatus} onTakeCharge={onTakeCharge} onClose={onClose} />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const {
    scenarioId,
    setScenarioId,
    clinicStatus,
    counts,
    activeCritical,
    activeWarnings,
    resolvedTickets,
    ticketStates,
    ticketClosures,
    anomalyTimeline,
    lastAlert,
    mostCriticalDepartment,
    setOpenConfirmTicketId,
    setCloseTicketId,
  } = useMonitoring()

  const recentAnomalies = anomalyTimeline.slice(0, 4)
  const HeaderIcon = headerIcons[scenarioId].icon

  return (
    <div className="space-y-6 pb-6 sm:space-y-8 sm:pb-8">
      <TicketModals />

      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div>
          <div className="flex items-start gap-2">
            <HeaderIcon
              className={cn("mt-0.5 size-5 shrink-0", headerIcons[scenarioId].className)}
              aria-hidden="true"
            />
            <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              {clinicStatus.label}
            </h1>
          </div>
          <p className="mt-2 max-w-xl text-sm font-medium text-slate-700">{clinicStatus.summary}</p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <ScenarioSwitcher value={scenarioId} onChange={setScenarioId} />
          <p className="text-sm font-medium text-slate-600">Aggiornato: {clinicStatus.updatedAt}</p>
        </div>
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
              <DeviceCard
                key={device.id}
                device={device}
                ticketStatus={ticketStates[device.id]}
                onTakeCharge={() => setOpenConfirmTicketId(device.id)}
                onClose={() => setCloseTicketId(device.id)}
              />
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
                <WarningRow
                  key={device.id}
                  device={device}
                  ticketStatus={ticketStates[device.id]}
                  onTakeCharge={() => setOpenConfirmTicketId(device.id)}
                  onClose={() => setCloseTicketId(device.id)}
                />
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

      {resolvedTickets.length > 0 && (
        <section className="space-y-3" aria-labelledby="resolved-heading">
          <h2
            id="resolved-heading"
            className="flex items-center gap-2 text-base font-bold text-emerald-800 sm:text-lg"
          >
            <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
            Ticket risolti
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {resolvedTickets.map((device) => {
              const closure = ticketClosures[device.id]

              return (
                <div
                  key={device.id}
                  className="rounded-xl border border-emerald-200 border-l-4 border-l-emerald-600 bg-white px-4 py-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-foreground">{device.id}</span>
                    <TicketStatusBadge status={TICKET_STATUS.CLOSED} />
                    <ClosureCriticalityBadge value={closure?.closureCriticality} />
                  </div>
                  <p className="mt-1 text-sm text-slate-700">{device.problem}</p>
                  {closure?.resolutionNotes && (
                    <p className="mt-2 text-sm text-foreground">
                      <span className="font-semibold text-slate-800">Intervento: </span>
                      {closure.resolutionNotes}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
