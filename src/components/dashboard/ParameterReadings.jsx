import { cn } from "@/lib/utils"
import { ALERT_STATUS } from "@/lib/alertEngine"

const statusStyles = {
  [ALERT_STATUS.OK]: "bg-emerald-50 text-emerald-900 border-emerald-200",
  [ALERT_STATUS.WARNING]: "bg-amber-50 text-amber-900 border-amber-200",
  [ALERT_STATUS.CRITICAL]: "bg-red-50 text-red-900 border-red-200",
}

export default function ParameterReadings({ alerts, compact = false }) {
  return (
    <div className={cn("grid gap-2", compact ? "sm:grid-cols-2" : "sm:grid-cols-3")}>
      {alerts.map((alert) => (
        <div
          key={alert.parameter}
          className={cn("rounded-lg border px-3 py-2", statusStyles[alert.status])}
        >
          <p className="text-xs font-semibold">{alert.parameterLabel}</p>
          <p className="mt-0.5 text-sm font-bold">{alert.formattedValue}</p>
          <p className="mt-1 text-xs font-medium capitalize">{alert.status}</p>
        </div>
      ))}
    </div>
  )
}
