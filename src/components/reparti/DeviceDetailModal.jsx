import { MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import ParameterReadings from "@/components/dashboard/ParameterReadings"
import DeviceTiming from "@/components/dashboard/DeviceTiming"
import { ALERT_STATUS } from "@/lib/alertEngine"
import { cn } from "@/lib/utils"

const borderStyles = {
  [ALERT_STATUS.CRITICAL]: "border-l-red-600",
  [ALERT_STATUS.WARNING]: "border-l-amber-600",
  [ALERT_STATUS.OK]: "border-l-emerald-600",
}

export default function DeviceDetailModal({ device, open, onClose }) {
  if (!open || !device) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Chiudi dettaglio dispositivo"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="device-detail-title"
        className={cn(
          "relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border bg-white shadow-xl border-l-4",
          borderStyles[device.overallStatus]
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b px-5 py-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="device-detail-title" className="text-lg font-bold text-foreground">
                {device.id}
              </h2>
              {device.priority && (
                <span className="rounded-full bg-red-700 px-2.5 py-0.5 text-xs font-semibold text-white">
                  Priorità {device.priority}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm font-medium text-slate-700">{device.typeLabel}</p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Chiudi">
            <X className="size-5" />
          </Button>
        </div>

        <div className="space-y-4 overflow-y-auto px-5 py-4">
          <p className="font-semibold text-foreground">{device.problem}</p>

          <ParameterReadings alerts={device.alerts} />

          {device.overallStatus !== ALERT_STATUS.OK && (
            <DeviceTiming
              detectedAt={device.updatedAt}
              timeToCritical={device.timeToCritical}
              variant={
                device.overallStatus === ALERT_STATUS.CRITICAL ? "critical" : "warning"
              }
            />
          )}

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 font-medium text-slate-800">
              <MapPin className="size-4 shrink-0 text-slate-600" aria-hidden="true" />
              {device.department}
            </div>
            <p>
              <span className="font-semibold text-slate-800">Stato: </span>
              <span className="capitalize">{device.overallStatus}</span>
            </p>
            <p>
              <span className="font-semibold text-slate-800">Ultimo aggiornamento: </span>
              {device.updatedAt}
            </p>
            <p>
              <span className="font-semibold text-slate-800">Azione consigliata: </span>
              {device.action}
            </p>
            {device.caseId && (
              <p>
                <span className="font-semibold text-slate-800">Caso EDA: </span>
                {device.caseId} — {device.caseTitle}
              </p>
            )}
            {device.risk && <p className="font-medium text-red-900">{device.risk}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
