import { cn } from "@/lib/utils"
import { closureCriticalityLabels } from "@/lib/ticketStatus"

const badgeStyles = {
  ok: "bg-emerald-100 text-emerald-900",
  warning: "bg-amber-100 text-amber-900",
  critical: "bg-red-100 text-red-900",
}

export default function ClosureCriticalityBadge({ value, className }) {
  if (!value) return null

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        badgeStyles[value],
        className
      )}
    >
      {closureCriticalityLabels[value]}
    </span>
  )
}
