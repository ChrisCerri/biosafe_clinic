import { Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

const statusConfig = {
  critical: {
    label: "Critico",
    className: "border border-border border-l-4 border-l-red-500 bg-white dark:bg-card",
    dot: "bg-red-500",
    labelClass: "text-red-600",
  },
  warning: {
    label: "Attenzione",
    className: "border border-border border-l-4 border-l-amber-500 bg-white dark:bg-card",
    dot: "bg-amber-500",
    labelClass: "text-amber-600",
  },
  ok: {
    label: "OK",
    className: "border border-border border-l-4 border-l-emerald-500 bg-white dark:bg-card",
    dot: "bg-emerald-500",
    labelClass: "text-emerald-600",
  },
}

export default function DepartmentOverview({ departments }) {
  return (
    <section className="rounded-xl border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Building2 className="size-4 text-muted-foreground" />
        <h2 className="font-semibold">Stato per reparto</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {departments.map((dept) => {
          const config = statusConfig[dept.status]
          return (
            <div
              key={dept.name}
              className={cn("rounded-lg px-4 py-3", config.className)}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-medium">{dept.name}</h3>
                <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold uppercase", config.labelClass)}>
                  <span className={cn("size-2 rounded-full", config.dot)} />
                  {config.label}
                </span>
              </div>
              <p className="mt-2 text-xs opacity-80">
                {dept.critical > 0 && `${dept.critical} critico · `}
                {dept.warning > 0 && `${dept.warning} warning · `}
                {dept.ok} OK
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
