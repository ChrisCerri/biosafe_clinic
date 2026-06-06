import { MapPin, ShieldAlert } from "lucide-react"
import DeviceTiming from "@/components/dashboard/DeviceTiming"
import ParameterReadings from "@/components/dashboard/ParameterReadings"

export default function DeviceCard({ device }) {
  return (
    <article className="rounded-xl border border-border border-l-4 border-l-red-600 bg-white p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-lg bg-red-50 p-2 text-red-700">
          <ShieldAlert className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold tracking-tight text-foreground">{device.id}</h3>
            <span className="text-sm font-medium text-slate-700">{device.typeLabel}</span>
            {device.priority && (
              <span className="rounded-full bg-red-700 px-2.5 py-0.5 text-xs font-semibold text-white">
                Priorità {device.priority}
              </span>
            )}
          </div>
          <p className="mt-1.5 font-semibold text-foreground">{device.problem}</p>
        </div>
      </div>

      <div className="mt-4">
        <ParameterReadings alerts={device.alerts} />
      </div>

      <div className="mt-4">
        <DeviceTiming
          detectedAt={device.updatedAt}
          timeToCritical={device.timeToCritical}
          variant="critical"
        />
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2 font-medium text-slate-800">
          <MapPin className="size-4 shrink-0 text-slate-600" aria-hidden="true" />
          <span>{device.department}</span>
        </div>
        <p className="text-foreground">
          <span className="font-semibold text-slate-800">Azione consigliata: </span>
          {device.action}
        </p>
        {device.risk && <p className="font-medium text-red-900">{device.risk}</p>}
      </div>
    </article>
  )
}
