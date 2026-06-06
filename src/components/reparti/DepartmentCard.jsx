import { AlertOctagon, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { ALERT_STATUS } from "@/lib/alertEngine"

const statusConfig = {
  critical: {
    label: "Critico",
    icon: AlertOctagon,
    border: "border-l-red-600",
    badge: "bg-red-100 text-red-900",
  },
  warning: {
    label: "Attenzione",
    icon: AlertTriangle,
    border: "border-l-amber-600",
    badge: "bg-amber-100 text-amber-900",
  },
  ok: {
    label: "OK",
    icon: CheckCircle2,
    border: "border-l-emerald-600",
    badge: "bg-emerald-100 text-emerald-900",
  },
}

const deviceStatusLabel = {
  [ALERT_STATUS.CRITICAL]: { label: "Critical", className: "text-red-700" },
  [ALERT_STATUS.WARNING]: { label: "Warning", className: "text-amber-700" },
  [ALERT_STATUS.OK]: { label: "OK", className: "text-emerald-700" },
}

function getDepartmentStatus(department) {
  if (department.critical > 0) return "critical"
  if (department.warning > 0) return "warning"
  return "ok"
}

export default function DepartmentCard({ department, onDeviceClick }) {
  const status = getDepartmentStatus(department)
  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <section
      className={cn(
        "flex flex-col rounded-xl border border-border bg-white border-l-4",
        config.border
      )}
    >
      <div className="border-b px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-bold text-foreground">{department.name}</h2>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {department.devices.length} dispositivi
            </p>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
              config.badge
            )}
          >
            <StatusIcon className="size-3.5" aria-hidden="true" />
            {config.label}
          </span>
        </div>
        <p className="mt-2 text-xs font-medium text-slate-600">
          {department.critical} critici · {department.warning} warning · {department.ok} OK
        </p>
        <p className="mt-2 text-xs font-medium text-primary">
          Clicca un dispositivo per aprire il dettaglio
        </p>
      </div>

      <ul className="flex-1 divide-y divide-border" aria-label={`Dispositivi ${department.name}`}>
        {department.devices.map((device) => (
          <li key={device.id}>
            <button
              type="button"
              onClick={() => onDeviceClick(device)}
              aria-label={`Apri dettaglio dispositivo ${device.id}`}
              className="group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-sky-50 focus-visible:bg-sky-50 focus-visible:outline-none"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-foreground">{device.id}</span>
                <span
                  className={cn(
                    "mt-0.5 block text-xs font-semibold capitalize",
                    deviceStatusLabel[device.overallStatus].className
                  )}
                >
                  {deviceStatusLabel[device.overallStatus].label}
                </span>
                <span className="mt-0.5 block text-xs font-medium text-slate-600">{device.typeLabel}</span>
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-primary opacity-80 transition-opacity group-hover:opacity-100">
                Dettaglio
                <ChevronRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
