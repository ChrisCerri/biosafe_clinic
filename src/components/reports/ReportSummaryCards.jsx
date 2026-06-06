import { Activity, AlertTriangle, Clock3, Percent } from "lucide-react"
import { cn } from "@/lib/utils"

const cards = [
  {
    key: "totalAlerts",
    label: "Allarmi totali",
    icon: Activity,
    tone: "primary",
    format: (value) => value,
  },
  {
    key: "avgResolutionHours",
    label: "Tempo medio risoluzione",
    icon: Clock3,
    tone: "muted",
    format: (value) => `${value} h`,
  },
  {
    key: "compliancePercent",
    label: "Conformità dispositivi",
    icon: Percent,
    tone: "ok",
    format: (value) => `${value}%`,
  },
  {
    key: "openCases",
    label: "Casi aperti",
    icon: AlertTriangle,
    tone: "warning",
    format: (value) => value,
  },
]

const toneStyles = {
  primary: "border-l-primary text-sky-900",
  muted: "border-l-slate-400 text-slate-800",
  ok: "border-l-emerald-600 text-emerald-900",
  warning: "border-l-amber-600 text-amber-900",
}

const iconStyles = {
  primary: "text-primary",
  muted: "text-slate-600",
  ok: "text-emerald-700",
  warning: "text-amber-700",
}

export default function ReportSummaryCards({ summary }) {
  return (
    <section
      aria-label="Riepilogo report"
      className="grid grid-cols-2 gap-3 xl:grid-cols-4"
    >
      {cards.map(({ key, label, icon: Icon, tone, format }) => (
        <div
          key={key}
          className={cn(
            "rounded-xl border border-border border-l-4 bg-white px-4 py-3",
            toneStyles[tone]
          )}
        >
          <div className="flex items-center gap-2">
            <Icon className={cn("size-4 shrink-0", iconStyles[tone])} aria-hidden="true" />
            <span className="text-sm font-semibold">{label}</span>
          </div>
          <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            {format(summary[key])}
          </p>
        </div>
      ))}
    </section>
  )
}
