export const chartAxisStyle = {
  fontSize: 12,
  fill: "#475569",
  fontWeight: 500,
}

export const chartGridStyle = {
  stroke: "#e2e8f0",
  strokeDasharray: "4 4",
}

export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-md">
      {label && <p className="mb-1 font-semibold text-foreground">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.name} className="font-medium text-slate-700" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
          {entry.unit ?? ""}
        </p>
      ))}
    </div>
  )
}
