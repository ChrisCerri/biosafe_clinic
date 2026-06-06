import { cn } from "@/lib/utils"
import { ALERT_STATUS } from "@/lib/alertEngine"
import ParameterReadings from "@/components/dashboard/ParameterReadings"
import DeviceTiming from "@/components/dashboard/DeviceTiming"
import TicketActions from "@/components/dashboard/TicketActions"
import TicketStatusBadge from "@/components/dashboard/TicketStatusBadge"
import { TICKET_STATUS } from "@/lib/ticketStatus"

const borderStyles = {
  [ALERT_STATUS.CRITICAL]: "border-l-red-600",
  [ALERT_STATUS.WARNING]: "border-l-amber-600",
  [ALERT_STATUS.OK]: "border-l-emerald-600",
}

export default function DepartmentDeviceRow({
  device,
  ticketStatus,
  onTakeCharge,
  onClose,
  showTickets = false,
}) {
  const isClosed = ticketStatus === TICKET_STATUS.CLOSED

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-white px-4 py-3",
        borderStyles[device.overallStatus],
        "border-l-4",
        isClosed && "opacity-75"
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-foreground">{device.id}</span>
        <span className="text-sm text-slate-700">{device.typeLabel}</span>
        {device.priority && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-semibold text-white",
              device.overallStatus === ALERT_STATUS.CRITICAL ? "bg-red-700" : "bg-amber-600"
            )}
          >
            {device.priority}
          </span>
        )}
        {showTickets && ticketStatus && <TicketStatusBadge status={ticketStatus} />}
      </div>

      <p className="mt-1 text-sm font-medium text-foreground">{device.problem}</p>

      <div className="mt-3">
        <ParameterReadings alerts={device.alerts} compact />
      </div>

      {device.overallStatus !== ALERT_STATUS.OK && (
        <div className="mt-3">
          <DeviceTiming
            detectedAt={device.updatedAt}
            timeToCritical={device.timeToCritical}
            variant={device.overallStatus === ALERT_STATUS.CRITICAL ? "critical" : "warning"}
          />
        </div>
      )}

      <p className="mt-3 text-sm">
        <span className="font-semibold text-slate-800">Azione consigliata: </span>
        {device.action}
      </p>

      {showTickets && device.overallStatus !== ALERT_STATUS.OK && (
        <div className="mt-3 border-t border-border pt-3">
          <TicketActions status={ticketStatus} onTakeCharge={onTakeCharge} onClose={onClose} />
        </div>
      )}
    </div>
  )
}
