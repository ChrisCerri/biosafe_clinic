import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import ReportChartCard from "@/components/reports/ReportChartCard"
import { ChartTooltip, chartAxisStyle, chartGridStyle } from "@/components/reports/chartStyles"
import { CHART_COLORS } from "@/lib/clinicData"

export default function AlertsByDepartmentChart({ data }) {
  return (
    <ReportChartCard
      title="Allarmi per reparto"
      description="Confronto critical e warning tra i reparti monitorati"
    >
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} {...chartGridStyle} />
            <XAxis
              dataKey="department"
              tick={chartAxisStyle}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-12}
              textAnchor="end"
              height={56}
            />
            <YAxis allowDecimals={false} tick={chartAxisStyle} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => (
                <span className="text-sm font-medium text-slate-700">{value}</span>
              )}
            />
            <Bar
              dataKey="warning"
              name="Warning"
              fill={CHART_COLORS.warning}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="critical"
              name="Critical"
              fill={CHART_COLORS.critical}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ReportChartCard>
  )
}
