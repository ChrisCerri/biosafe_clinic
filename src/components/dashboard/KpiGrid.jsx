import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  LayoutGrid,
} from "lucide-react"
import { cn } from "@/lib/utils"

const kpiConfig = [
  { key: "critical", label: "Dispositivi critical", tone: "critical", icon: AlertOctagon },
  { key: "warning", label: "Dispositivi warning", tone: "warning", icon: AlertTriangle },
  { key: "ok", label: "Dispositivi normali", tone: "ok", icon: CheckCircle2 },
  { key: "total", label: "Dispositivi totali", tone: "total", icon: LayoutGrid },
]

const kpiStyles = {
  critical: "border-l-red-600",
  warning: "border-l-amber-600",
  ok: "border-l-emerald-600",
  total: "border-l-slate-400",
}

const kpiLabelStyles = {
  critical: "text-red-800",
  warning: "text-amber-900",
  ok: "text-emerald-900",
  total: "text-slate-700",
}

const kpiIconStyles = {
  critical: "text-red-700",
  warning: "text-amber-700",
  ok: "text-emerald-700",
  total: "text-slate-600",
}

function StatusKpi({ label, count, tone, icon: Icon }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border border-l-4 bg-white px-4 py-3",
        kpiStyles[tone]
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className={cn("size-4 shrink-0", kpiIconStyles[tone])} aria-hidden="true" />
        <span className={cn("text-sm font-semibold", kpiLabelStyles[tone])}>{label}</span>
      </div>
      <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">{count}</p>
    </div>
  )
}

export default function KpiGrid({ counts }) {
  return (
    <section aria-label="Riepilogo dispositivi" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {kpiConfig.map(({ key, label, tone, icon }) => (
        <StatusKpi key={key} label={label} count={counts[key]} tone={tone} icon={icon} />
      ))}
    </section>
  )
}
