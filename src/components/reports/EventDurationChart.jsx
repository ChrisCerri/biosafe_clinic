import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import ReportChartCard from "@/components/reports/ReportChartCard"
import { ChartTooltip, chartAxisStyle, chartGridStyle } from "@/components/reports/chartStyles"
import { CHART_COLORS } from "@/lib/clinicData"

export default function EventDurationChart({ data }) {
  return (
    <ReportChartCard
      title="Durata eventi anomalia"
      description="Distribuzione eventi per fascia di durata"
    >
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} {...chartGridStyle} />
            <XAxis dataKey="range" tick={chartAxisStyle} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={chartAxisStyle} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar
              dataKey="count"
              name="Eventi"
              fill={CHART_COLORS.primary}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ReportChartCard>
  )
}
