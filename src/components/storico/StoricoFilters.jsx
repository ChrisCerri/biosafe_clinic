import { CalendarRange, RotateCcw, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

function parseInputDate(value) {
  if (!value) return null
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function toInputDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function shiftInputDate(value, days) {
  const date = parseInputDate(value)
  date.setDate(date.getDate() + days)
  return toInputDate(date)
}

function formatDateLabel(value) {
  return parseInputDate(value).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
  })
}

function buildPresets(minDate, maxDate) {
  return [
    { id: "all", label: "Tutto", from: "", to: "" },
    {
      id: "7d",
      label: "Ultimi 7 giorni",
      from: shiftInputDate(maxDate, -6),
      to: maxDate,
    },
    {
      id: "14d",
      label: "Ultimi 14 giorni",
      from: shiftInputDate(maxDate, -13),
      to: maxDate,
    },
    { id: "full", label: "Intero dataset", from: minDate, to: maxDate },
  ]
}

function isPresetActive(preset, dateFrom, dateTo) {
  return preset.from === dateFrom && preset.to === dateTo
}

function normalizeDateRange(from, to) {
  if (!from || !to) return { from, to }
  if (parseInputDate(from) > parseInputDate(to)) {
    return { from: to, to: from }
  }
  return { from, to }
}

export default function StoricoFilters({
  searchQuery,
  onSearchChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  minDate,
  maxDate,
  filteredCount,
  totalCount,
  onReset,
}) {
  const presets = buildPresets(minDate, maxDate)
  const hasActiveFilters = searchQuery.trim() !== "" || dateFrom || dateTo
  const activePreset = presets.find((preset) => isPresetActive(preset, dateFrom, dateTo))

  function applyPreset(preset) {
    onDateFromChange(preset.from)
    onDateToChange(preset.to)
  }

  function handleDateFromChange(value) {
    const next = normalizeDateRange(value, dateTo)
    onDateFromChange(next.from)
    onDateToChange(next.to)
  }

  function handleDateToChange(value) {
    const next = normalizeDateRange(dateFrom, value)
    onDateFromChange(next.from)
    onDateToChange(next.to)
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="border-b border-border bg-sky-50/50 px-4 py-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Cerca per dispositivo, reparto, parametro, severità..."
              aria-label="Cerca nello storico eventi"
              className="h-11 w-full rounded-xl border border-border bg-white py-2 pl-10 pr-10 text-sm font-medium text-foreground placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:bg-sky-50 hover:text-slate-700"
                aria-label="Cancella ricerca"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex h-11 items-center overflow-hidden rounded-xl border border-border bg-white">
              <div className="flex h-full items-center gap-1.5 border-r border-border bg-sky-50/80 px-3 text-xs font-semibold text-slate-700">
                <CalendarRange className="size-4 text-primary" aria-hidden="true" />
                <span className="hidden sm:inline">Periodo</span>
              </div>

              <label className="sr-only" htmlFor="storico-date-from">
                Data inizio
              </label>
              <input
                id="storico-date-from"
                type="date"
                value={dateFrom}
                min={minDate}
                max={dateTo || maxDate}
                onChange={(event) => handleDateFromChange(event.target.value)}
                className="h-full min-w-35 border-0 bg-transparent px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/20"
              />

              <span className="text-xs font-semibold text-slate-400" aria-hidden="true">
                →
              </span>

              <label className="sr-only" htmlFor="storico-date-to">
                Data fine
              </label>
              <input
                id="storico-date-to"
                type="date"
                value={dateTo}
                min={dateFrom || minDate}
                max={maxDate}
                onChange={(event) => handleDateToChange(event.target.value)}
                className="h-full min-w-35 border-0 bg-transparent px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/20"
              />
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-white px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-sky-50"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                isPresetActive(preset, dateFrom, dateTo)
                  ? "bg-primary text-primary-foreground"
                  : "bg-sky-50 text-sky-900 hover:bg-sky-100"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <p className="text-xs font-medium text-slate-600">
          <span className="font-semibold text-foreground">{filteredCount}</span> di{" "}
          {totalCount} eventi
          {hasActiveFilters ? " · filtri attivi" : ""}
        </p>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-2.5">
          <span className="text-xs font-semibold text-slate-500">Attivi:</span>

          {searchQuery.trim() && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-900 hover:bg-sky-100"
            >
              Ricerca: {searchQuery.trim()}
              <X className="size-3" aria-hidden="true" />
            </button>
          )}

          {(dateFrom || dateTo) && (
            <button
              type="button"
              onClick={() => applyPreset(presets[0])}
              className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-900 hover:bg-sky-100"
            >
              {dateFrom && dateTo
                ? `${formatDateLabel(dateFrom)} → ${formatDateLabel(dateTo)}`
                : dateFrom
                  ? `Dal ${formatDateLabel(dateFrom)}`
                  : `Al ${formatDateLabel(dateTo)}`}
              <X className="size-3" aria-hidden="true" />
            </button>
          )}

          {activePreset && activePreset.id !== "all" && (
            <span className="text-xs font-medium text-slate-500">· {activePreset.label}</span>
          )}
        </div>
      )}
    </div>
  )
}
