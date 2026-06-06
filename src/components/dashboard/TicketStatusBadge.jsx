import { cn } from "@/lib/utils"
import { TICKET_STATUS, ticketStatusLabels } from "@/lib/ticketStatus"

const badgeStyles = {
  [TICKET_STATUS.OPEN]: "bg-slate-100 text-slate-800",
  [TICKET_STATUS.IN_PROGRESS]: "bg-sky-100 text-sky-900",
  [TICKET_STATUS.CLOSED]: "bg-emerald-100 text-emerald-900",
}

export default function TicketStatusBadge({ status, className }) {
  if (status === TICKET_STATUS.OPEN) return null

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        badgeStyles[status],
        className
      )}
    >
      {ticketStatusLabels[status]}
    </span>
  )
}
