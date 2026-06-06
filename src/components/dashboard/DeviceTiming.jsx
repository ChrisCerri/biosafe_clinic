import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DeviceTiming({ detectedAt, timeToCritical, variant = "critical" }) {
  const boxStyles = {
    critical: "border-red-200 bg-red-50",
    warning: "border-amber-200 bg-amber-50",
  }

  const valueStyles = {
    critical: "text-red-900",
    warning: "text-amber-900",
  }

  const criticalValueStyles = {
    critical: "text-red-800",
    warning: "text-amber-800",
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 rounded-lg border px-3 py-2.5 sm:grid-cols-2 sm:gap-4",
        boxStyles[variant]
      )}
    >
      <div>
        <div className="flex items-center gap-1.5">
          <Clock className="size-3.5 shrink-0 text-slate-600" aria-hidden="true" />
          <p className="text-xs font-semibold text-slate-800">Orario di rilevamento</p>
        </div>
        <p className={cn("mt-0.5 text-base font-bold", valueStyles[variant])}>{detectedAt}</p>
      </div>
      <div className="sm:border-l sm:border-black/10 sm:pl-4">
        <p className="text-xs font-semibold text-slate-800">Tempo alla criticità</p>
        <p className={cn("mt-0.5 text-base font-bold", criticalValueStyles[variant])}>
          {timeToCritical ?? "Non stimato"}
        </p>
      </div>
    </div>
  )
}
