export const TICKET_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  CLOSED: "closed",
}

export const ticketStatusLabels = {
  [TICKET_STATUS.OPEN]: "Aperto",
  [TICKET_STATUS.IN_PROGRESS]: "In corso",
  [TICKET_STATUS.CLOSED]: "Risolto",
}

export function createInitialTicketState(devices) {
  return Object.fromEntries(devices.map((device) => [device.id, TICKET_STATUS.OPEN]))
}

export const CLOSURE_CRITICALITY = {
  OK: "ok",
  WARNING: "warning",
  CRITICAL: "critical",
}

export const closureCriticalityOptions = [
  { value: CLOSURE_CRITICALITY.OK, label: "OK — problema risolto" },
  { value: CLOSURE_CRITICALITY.WARNING, label: "Attenzione — monitoraggio necessario" },
  { value: CLOSURE_CRITICALITY.CRITICAL, label: "Critico — rischio residuo" },
]

export const closureCriticalityLabels = Object.fromEntries(
  closureCriticalityOptions.map((option) => [option.value, option.label])
)
