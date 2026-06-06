import { AlertOctagon, AlertTriangle, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAnomalyCases, getAnomalyEvents, getDatasetMeta, DATA_SOURCE_LABEL } from "@/lib/clinicData"

const severityConfig = {
  CRITICAL: {
    label: "Critico",
    icon: AlertOctagon,
    border: "border-l-red-600",
    badge: "bg-red-100 text-red-900",
  },
  WARNING: {
    label: "Warning",
    icon: AlertTriangle,
    border: "border-l-amber-600",
    badge: "bg-amber-100 text-amber-900",
  },
  WATCH: {
    label: "Watch",
    icon: Eye,
    border: "border-l-slate-400",
    badge: "bg-slate-100 text-slate-800",
  },
}

function CaseCard({ anomalyCase }) {
  const config = severityConfig[anomalyCase.severity]
  const Icon = config.icon

  return (
    <article
      className={cn(
        "rounded-xl border border-border border-l-4 bg-white p-4",
        config.border
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
              {anomalyCase.case_id}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                config.badge
              )}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {config.label}
            </span>
          </div>
          <h2 className="mt-2 text-base font-bold text-foreground">{anomalyCase.title}</h2>
          <p className="mt-1 text-sm font-medium text-slate-700">{anomalyCase.plain_language_alert}</p>
        </div>
      </div>

      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-slate-800">Dispositivo</dt>
          <dd className="text-foreground">
            {anomalyCase.device_id} · {anomalyCase.typeLabel}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-800">Reparto</dt>
          <dd className="text-foreground">{anomalyCase.department}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-800">Parametro</dt>
          <dd className="capitalize text-foreground">{anomalyCase.main_parameter.replaceAll("_", " ")}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-800">Range valori</dt>
          <dd className="text-foreground">
            {anomalyCase.min_value} – {anomalyCase.max_value}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-800">Letture critical</dt>
          <dd className="text-foreground">{anomalyCase.critical_readings}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-800">Letture warning</dt>
          <dd className="text-foreground">{anomalyCase.warning_readings}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-semibold text-slate-800">Periodo</dt>
          <dd className="text-foreground">
            {anomalyCase.periodStartLabel} → {anomalyCase.periodEndLabel}
          </dd>
        </div>
      </dl>
    </article>
  )
}

export default function Allarmi() {
  const cases = getAnomalyCases().sort((a, b) => {
    const weight = { CRITICAL: 2, WARNING: 1, WATCH: 0 }
    return weight[b.severity] - weight[a.severity]
  })

  const meta = getDatasetMeta()

  const criticalCount = cases.filter((item) => item.severity === "CRITICAL").length
  const warningCount = cases.filter((item) => item.severity === "WARNING").length

  return (
    <div className="space-y-6 pb-6">
      <header>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Allarmi</h1>
        <p className="mt-1 max-w-2xl text-sm font-medium text-slate-700">
          Casi anomalia rilevati dall&apos;analisi EDA sui sensori. {DATA_SOURCE_LABEL}.
        </p>
        <p className="mt-2 text-xs font-medium text-slate-600">
          {cases.length} casi da {meta.anomalyCases} · {criticalCount} critici · {warningCount}{" "}
          warning · {meta.anomalyEvents} eventi sensori
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {cases.map((anomalyCase) => (
          <CaseCard key={anomalyCase.case_id} anomalyCase={anomalyCase} />
        ))}
      </div>
    </div>
  )
}
