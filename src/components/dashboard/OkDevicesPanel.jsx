import { CheckCircle2 } from "lucide-react"

export default function OkDevicesPanel({ devices }) {
  return (
    <section className="rounded-xl border border-border border-l-4 border-l-emerald-500 bg-white px-4 py-3 dark:bg-card">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600" />
          <h2 className="text-sm font-semibold">Dispositivi OK</h2>
        </div>
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          {devices.length} attivi
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {devices.map((device) => (
          <span
            key={device.id}
            className="inline-flex items-center gap-1.5 rounded-md border bg-muted/40 px-2 py-1 text-xs"
            title={device.department}
          >
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {device.id}
            <span className="text-emerald-700/70 dark:text-emerald-300/70">· {device.department}</span>
          </span>
        ))}
      </div>
    </section>
  )
}
