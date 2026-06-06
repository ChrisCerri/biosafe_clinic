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

export default function AlertsByDeviceTypeChart({ data }) {
  return (
    <ReportChartCard
      title="Allarmi per tipo dispositivo"
      description="Critical e warning suddivisi per categoria"
    >
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
          >
            <CartesianGrid horizontal={false} {...chartGridStyle} />
            <XAxis type="number" allowDecimals={false} tick={chartAxisStyle} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="label"
              tick={chartAxisStyle}
              axisLine={false}
              tickLine={false}
              width={96}
            />
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
              radius={[0, 4, 4, 0]}
              stackId="type"
            />
            <Bar
              dataKey="critical"
              name="Critical"
              fill={CHART_COLORS.critical}
              radius={[0, 4, 4, 0]}
              stackId="type"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ReportChartCard>
  )
}
