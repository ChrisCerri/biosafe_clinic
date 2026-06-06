import { cn } from "@/lib/utils"

const severityStyles = {
  critical: "border-l-4 border-l-red-600 bg-white",
  warning: "border-l-4 border-l-amber-600 bg-white",
  ok: "border-l-4 border-l-emerald-600 bg-white",
}

const dotStyles = {
  critical: "bg-red-600",
  warning: "bg-amber-600",
  ok: "bg-emerald-600",
}

export default function AnomalyTimeline({ events }) {
  return (
    <section className="rounded-xl border border-border bg-white" aria-labelledby="timeline-heading">
      <div className="border-b px-4 py-4 sm:px-5">
        <p className="text-sm font-medium text-slate-700">Gli eventi più recenti</p>
      </div>
      <ol className="divide-y divide-border">
        {events.map((event) => (
          <li
            key={event.id}
            className={cn("px-4 py-3 sm:px-5", severityStyles[event.severity])}
          >
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-mono text-sm font-bold text-foreground">{event.time}</span>
              <span className={cn("size-2 rounded-full", dotStyles[event.severity])} aria-hidden="true" />
              <span className="text-sm font-semibold text-foreground">{event.device}</span>
              <span className="text-sm font-medium text-slate-700">· {event.department}</span>
            </div>
            <p className="mt-1 text-sm font-medium text-foreground">{event.message}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
