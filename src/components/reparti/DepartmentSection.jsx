import { AlertOctagon, AlertTriangle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ALERT_STATUS } from "@/lib/alertEngine"
import DepartmentDeviceRow from "@/components/reparti/DepartmentDeviceRow"

const statusConfig = {
  critical: { label: "Critico", icon: AlertOctagon, className: "text-red-700" },
  warning: { label: "Attenzione", icon: AlertTriangle, className: "text-amber-700" },
  ok: { label: "OK", icon: CheckCircle2, className: "text-emerald-700" },
}

function getDepartmentStatus(department) {
  if (department.critical > 0) return "critical"
  if (department.warning > 0) return "warning"
  return "ok"
}

export default function DepartmentSection({ department }) {
  const status = getDepartmentStatus(department)
  const StatusIcon = statusConfig[status].icon
  const alertDevices = department.devices.filter(
    (device) => device.overallStatus !== ALERT_STATUS.OK
  )
  const okDevices = department.devices.filter(
    (device) => device.overallStatus === ALERT_STATUS.OK
  )

  return (
    <section className="rounded-xl border border-border bg-white">
      <div className="border-b px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">{department.name}</h2>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {department.critical} critici · {department.warning} warning · {department.ok} OK
            </p>
          </div>
          <div className={cn("flex items-center gap-2 text-sm font-semibold", statusConfig[status].className)}>
            <StatusIcon className="size-4" aria-hidden="true" />
            {statusConfig[status].label}
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        {alertDevices.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wide text-red-800">
              Avvisi critici e warning
            </h3>
            {alertDevices.map((device) => (
              <DepartmentDeviceRow key={device.id} device={device} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
            Nessun avviso attivo in questo reparto.
          </p>
        )}

        {okDevices.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-emerald-800">
              Dispositivi OK
            </h3>
            <div className="flex flex-wrap gap-2">
              {okDevices.map((device) => (
                <span
                  key={device.id}
                  className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-900"
                >
                  {device.id} · {device.typeLabel}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
