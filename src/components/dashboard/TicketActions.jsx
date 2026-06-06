import { CheckCircle2, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import TicketStatusBadge from "@/components/dashboard/TicketStatusBadge"
import { TICKET_STATUS } from "@/lib/ticketStatus"

export default function TicketActions({ status, onTakeCharge, onClose }) {
  if (status === TICKET_STATUS.CLOSED) {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-emerald-800">
        <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
        <span>Ticket chiuso</span>
        <TicketStatusBadge status={status} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      {status === TICKET_STATUS.IN_PROGRESS && (
        <p className="text-sm font-semibold text-sky-800">Intervento in corso</p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <TicketStatusBadge status={status} />
        {status === TICKET_STATUS.OPEN && (
          <Button type="button" size="sm" onClick={onTakeCharge}>
            <UserCheck className="size-4" aria-hidden="true" />
            Presa in carico
          </Button>
        )}
        {status === TICKET_STATUS.IN_PROGRESS && (
          <Button type="button" size="sm" variant="outline" onClick={onClose}>
            Chiudi ticket
          </Button>
        )}
      </div>
    </div>
  )
}
