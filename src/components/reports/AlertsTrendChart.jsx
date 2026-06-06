import {
  Area,
  AreaChart,
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

export default function AlertsTrendChart({ data }) {
  return (
    <ReportChartCard
      title="Trend allarmi"
      description="Andamento critical e warning nel periodo selezionato"
    >
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} {...chartGridStyle} />
            <XAxis dataKey="label" tick={chartAxisStyle} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={chartAxisStyle} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => (
                <span className="text-sm font-medium text-slate-700">{value}</span>
              )}
            />
            <Area
              type="monotone"
              dataKey="warning"
              name="Warning"
              stackId="alerts"
              stroke={CHART_COLORS.warning}
              fill={CHART_COLORS.warning}
              fillOpacity={0.35}
            />
            <Area
              type="monotone"
              dataKey="critical"
              name="Critical"
              stackId="alerts"
              stroke={CHART_COLORS.critical}
              fill={CHART_COLORS.critical}
              fillOpacity={0.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ReportChartCard>
  )
}
