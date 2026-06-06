import { scenarioOptions } from "@/data/dashboardScenarios"

export default function ScenarioSwitcher({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="scenario-select" className="text-xs font-medium text-slate-600">
        Scenario
      </label>
      <select
        id="scenario-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Seleziona scenario operativo"
        className="h-8 min-w-[10rem] rounded-md border border-input bg-white px-2.5 text-sm font-medium text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {scenarioOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
