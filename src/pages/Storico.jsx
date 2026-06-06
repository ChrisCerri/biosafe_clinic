import { useMemo, useState } from "react"
import { History } from "lucide-react"
import { cn } from "@/lib/utils"
import StoricoFilters from "@/components/storico/StoricoFilters"
import { getAnomalyEvents, getDatasetMeta, DATA_SOURCE_LABEL } from "@/lib/clinicData"

const severityStyles = {
  critical: "bg-red-100 text-red-900",
  warning: "bg-amber-100 text-amber-900",
}

function toInputDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function parseInputDate(value) {
  if (!value) return null
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function startOfDay(date) {
  const value = new Date(date)
  value.setHours(0, 0, 0, 0)
  return value
}

function endOfDay(date) {
  const value = new Date(date)
  value.setHours(23, 59, 59, 999)
  return value
}

function formatDateLabel(value) {
  return parseInputDate(value).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function matchesSearch(event, query) {
  const haystack = [
    event.device_id,
    event.department,
    event.reparto,
    event.parameterLabel,
    event.main_parameter,
    event.severity,
    event.typeLabel,
    event.device_type,
    event.startLabel,
    event.endLabel,
    String(event.min_value),
    String(event.max_value),
    String(event.durationHours),
  ]
    .join(" ")
    .toLowerCase()

  return haystack.includes(query)
}

function eventOverlapsDateRange(event, dateFrom, dateTo) {
  if (!dateFrom && !dateTo) return true

  const eventStart = new Date(event.start_time)
  const eventEnd = new Date(event.end_time)
  const rangeStart = dateFrom ? startOfDay(parseInputDate(dateFrom)) : null
  const rangeEnd = dateTo ? endOfDay(parseInputDate(dateTo)) : null

  if (rangeStart && eventEnd < rangeStart) return false
  if (rangeEnd && eventStart > rangeEnd) return false

  return true
}

export default function Storico() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const events = useMemo(() => getAnomalyEvents(), [])
  const meta = getDatasetMeta()

  const { minDate, maxDate } = useMemo(() => {
    if (events.length === 0) {
      return { minDate: "", maxDate: "" }
    }

    const timestamps = events.flatMap((event) => [
      new Date(event.start_time).getTime(),
      new Date(event.end_time).getTime(),
    ])

    return {
      minDate: toInputDate(new Date(Math.min(...timestamps))),
      maxDate: toInputDate(new Date(Math.max(...timestamps))),
    }
  }, [events])

  const filteredEvents = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return events.filter((event) => {
      const matchesQuery = normalizedQuery === "" || matchesSearch(event, normalizedQuery)
      const matchesDateRange = eventOverlapsDateRange(event, dateFrom, dateTo)

      return matchesQuery && matchesDateRange
    })
  }, [events, searchQuery, dateFrom, dateTo])

  const hasActiveFilters = searchQuery.trim() !== "" || dateFrom || dateTo

  function resetFilters() {
    setSearchQuery("")
    setDateFrom("")
    setDateTo("")
  }

  return (
    <div className="space-y-6 pb-6">
      <header>
        <div className="flex items-center gap-2">
          <History className="size-5 text-primary" aria-hidden="true" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">Storico</h1>
        </div>
        <p className="mt-1 max-w-2xl text-sm font-medium text-slate-700">
          Cronologia eventi anomalia aggregati dai sensori. {DATA_SOURCE_LABEL}.
        </p>
        <p className="mt-2 text-xs font-medium text-slate-600">
          {meta.anomalyEvents} eventi nel dataset ·{" "}
          {meta.sensorReadings.toLocaleString("it-IT")} letture sensori analizzate
        </p>
      </header>

      <StoricoFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        minDate={minDate}
        maxDate={maxDate}
        filteredCount={filteredEvents.length}
        totalCount={events.length}
        onReset={resetFilters}
      />

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-sky-50/60 text-xs font-semibold uppercase tracking-wide text-slate-700">
              <tr>
                <th className="px-4 py-3">Inizio</th>
                <th className="px-4 py-3">Dispositivo</th>
                <th className="px-4 py-3">Reparto</th>
                <th className="px-4 py-3">Parametro</th>
                <th className="px-4 py-3">Severità</th>
                <th className="px-4 py-3">Durata</th>
                <th className="px-4 py-3">Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-sky-50/40">
                    <td className="px-4 py-3 font-medium text-foreground">{event.startLabel}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-foreground">{event.device_id}</span>
                      <span className="mt-0.5 block text-xs text-slate-600">{event.typeLabel}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{event.department}</td>
                    <td className="px-4 py-3 capitalize text-slate-700">{event.parameterLabel}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                          severityStyles[event.severity]
                        )}
                      >
                        {event.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{event.durationHours} h</td>
                    <td className="px-4 py-3 text-slate-700">
                      {event.min_value} – {event.max_value}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm font-medium text-slate-600">
                    Nessun evento trovato
                    {hasActiveFilters ? " con i filtri selezionati" : "."}
                    {searchQuery.trim() ? ` · ricerca "${searchQuery.trim()}"` : ""}
                    {dateFrom || dateTo
                      ? ` · periodo ${dateFrom ? formatDateLabel(dateFrom) : "..."} → ${dateTo ? formatDateLabel(dateTo) : "..."}`
                      : ""}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
