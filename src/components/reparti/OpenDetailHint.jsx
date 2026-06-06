import { MousePointerClick } from "lucide-react"

export default function OpenDetailHint() {
  return (
    <div className="mb-4 flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <MousePointerClick className="size-4" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">Apri il dettaglio dispositivo</p>
        <p className="mt-0.5 text-sm text-slate-700">
          Seleziona un dispositivo dall&apos;elenco per vedere parametri, stato e gestione ticket.
        </p>
      </div>
    </div>
  )
}
