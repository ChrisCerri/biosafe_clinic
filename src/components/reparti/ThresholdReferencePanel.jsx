import { thresholdReference } from "@/lib/deviceThresholds"

const statusEmoji = {
  ok: "🟢",
  warning: "🟡",
  critical: "🔴",
}

export default function ThresholdReferencePanel() {
  return (
    <section className="rounded-xl border border-border bg-white">
      <div className="border-b px-5 py-4">
        <h2 className="text-lg font-bold text-foreground">Soglie di riferimento</h2>
        <p className="mt-1 text-sm font-medium text-slate-700">
          Classificazione alert per tipo dispositivo e parametro.
        </p>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-2">
        {thresholdReference.map((group) => (
          <div key={group.type} className="rounded-lg border border-border p-4">
            <h3 className="font-semibold text-foreground">{group.label}</h3>
            {group.note && (
              <p className="mt-1 text-xs font-medium text-amber-800">{group.note}</p>
            )}

            <div className="mt-3 space-y-3">
              {Object.entries(group.parameters).map(([parameter, rows]) => (
                <div key={parameter}>
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-700">
                    {parameter === "temperature"
                      ? "Temperatura"
                      : parameter === "vibration"
                        ? "Vibrazione"
                        : "Livello azoto"}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b text-slate-600">
                          <th className="py-1 pr-2 font-semibold">Stato</th>
                          <th className="py-1 font-semibold">Valore</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row) => (
                          <tr key={row.status} className="border-b border-border/60">
                            <td className="py-1.5 pr-2 font-medium">
                              {statusEmoji[row.status]} {row.label}
                            </td>
                            <td className="py-1.5 font-medium text-slate-800">{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
