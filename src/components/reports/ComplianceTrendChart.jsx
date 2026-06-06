import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import ReportChartCard from "@/components/reports/ReportChartCard"
import { ChartTooltip, chartAxisStyle, chartGridStyle } from "@/components/reports/chartStyles"
import { CHART_COLORS } from "@/lib/clinicData"

export default function ComplianceTrendChart({ data }) {
  return (
    <ReportChartCard
      title="Conformità dispositivi"
      description="Percentuale di dispositivi nella norma nel tempo"
    >
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid vertical={false} {...chartGridStyle} />
            <XAxis dataKey="label" tick={chartAxisStyle} axisLine={false} tickLine={false} />
            <YAxis
              domain={[95, 100]}
              tick={chartAxisStyle}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              content={({ active, payload, label }) => (
                <ChartTooltip
                  active={active}
                  label={label}
                  payload={payload?.map((entry) => ({
                    ...entry,
                    name: "Conformità",
                    value: `${entry.value}%`,
                    unit: "",
                  }))}
                />
              )}
            />
            <ReferenceLine
              y={98}
              stroke={CHART_COLORS.warning}
              strokeDasharray="4 4"
              label={{
                value: "Soglia 98%",
                position: "insideTopRight",
                fill: CHART_COLORS.muted,
                fontSize: 11,
                fontWeight: 600,
              }}
            />
            <Line
              type="monotone"
              dataKey="compliance"
              name="Conformità"
              stroke={CHART_COLORS.ok}
              strokeWidth={3}
              dot={{ r: 4, fill: CHART_COLORS.ok, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ReportChartCard>
  )
}
