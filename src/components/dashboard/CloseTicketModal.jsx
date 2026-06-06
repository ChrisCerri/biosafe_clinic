import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { closureCriticalityOptions } from "@/lib/ticketStatus"

export default function CloseTicketModal({ open, ticketId, onSubmit, onCancel }) {
  const [resolutionNotes, setResolutionNotes] = useState("")
  const [closureCriticality, setClosureCriticality] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      setResolutionNotes("")
      setClosureCriticality("")
      setError("")
    }
  }, [open, ticketId])

  const handleSubmit = () => {
    if (!resolutionNotes.trim()) {
      setError("Descrivi cosa è stato fatto per risolvere il problema.")
      return
    }

    if (!closureCriticality) {
      setError("Seleziona lo stato della criticità alla chiusura.")
      return
    }

    onSubmit({
      resolutionNotes: resolutionNotes.trim(),
      closureCriticality,
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Chiudi modale"
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="close-ticket-title"
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border bg-white shadow-xl"
      >
        <div className="border-b px-6 py-4">
          <h2 id="close-ticket-title" className="text-lg font-bold text-foreground">
            Chiudi ticket
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-700">
            Sei sicuro di voler chiudere il ticket{ticketId ? ` ${ticketId}` : ""}? Compila i
            dettagli di chiusura.
          </p>
        </div>

        <div className="space-y-4 overflow-y-auto px-6 py-4">
          <div>
            <label htmlFor="resolution-notes" className="text-sm font-semibold text-foreground">
              Cosa è stato fatto per risolvere
            </label>
            <textarea
              id="resolution-notes"
              value={resolutionNotes}
              onChange={(event) => {
                setResolutionNotes(event.target.value)
                setError("")
              }}
              rows={4}
              placeholder="Es. Ricaricato azoto, verificata tenuta del serbatoio, campioni controllati."
              className="mt-2 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>

          <div>
            <label htmlFor="closure-criticality" className="text-sm font-semibold text-foreground">
              Stato criticità alla chiusura
            </label>
            <select
              id="closure-criticality"
              value={closureCriticality}
              onChange={(event) => {
                setClosureCriticality(event.target.value)
                setError("")
              }}
              className="mt-2 h-10 w-full rounded-md border border-input bg-white px-3 text-sm font-medium text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="">Seleziona stato</option>
              {closureCriticalityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm font-medium text-red-700" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t px-6 py-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annulla
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Chiudi ticket
          </Button>
        </div>
      </div>
    </div>
  )
}
