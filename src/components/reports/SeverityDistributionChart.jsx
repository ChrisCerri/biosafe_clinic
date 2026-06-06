import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import ReportChartCard from "@/components/reports/ReportChartCard"
import { ChartTooltip } from "@/components/reports/chartStyles"

export default function SeverityDistributionChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <ReportChartCard
      title="Distribuzione severità"
      description="Ripartizione eventi per livello di criticità"
    >
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={96}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="white" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
            <Legend
              verticalAlign="bottom"
              formatter={(value, entry) => {
                const percent = total
                  ? Math.round((entry.payload.value / total) * 100)
                  : 0
                return (
                  <span className="text-sm font-medium text-slate-700">
                    {value} ({percent}%)
                  </span>
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ReportChartCard>
  )
}
