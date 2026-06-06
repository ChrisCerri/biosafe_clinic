import { useMemo, useState } from "react"
import { BarChart3, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import AlertsTrendChart from "@/components/reports/AlertsTrendChart"
import AlertsByDepartmentChart from "@/components/reports/AlertsByDepartmentChart"
import AlertsByDeviceTypeChart from "@/components/reports/AlertsByDeviceTypeChart"
import ComplianceTrendChart from "@/components/reports/ComplianceTrendChart"
import ReportSummaryCards from "@/components/reports/ReportSummaryCards"
import SeverityDistributionChart from "@/components/reports/SeverityDistributionChart"
import EventDurationChart from "@/components/reports/EventDurationChart"
import { getReportData, getDatasetMeta, reportPeriods, DATA_SOURCE_LABEL } from "@/lib/clinicData"
import { cn } from "@/lib/utils"

export default function Report() {
  const [periodId, setPeriodId] = useState("30d")

  const reportData = useMemo(() => getReportData(periodId), [periodId])
  const meta = getDatasetMeta()

  return (
    <div className="space-y-6 pb-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="size-5 text-primary" aria-hidden="true" />
            <h1 className="text-xl font-bold tracking-tight text-foreground">Report</h1>
          </div>
          <p className="mt-1 max-w-2xl text-sm font-medium text-slate-700">
            Analisi storica di allarmi, conformità e eventi dispositivi. Dati da{" "}
            {DATA_SOURCE_LABEL.toLowerCase()} — {meta.sensorReadings.toLocaleString("it-IT")}{" "}
            letture, {meta.anomalyEvents} eventi, {meta.anomalyCases} casi.
          </p>
        </div>

        <Button type="button" variant="outline" size="sm" disabled title="Disponibile a breve">
          <Download className="size-4" aria-hidden="true" />
          Esporta PDF
        </Button>
      </header>

      <ReportSummaryCards summary={reportData.summary} />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-slate-700">Periodo:</span>
        {reportPeriods.map((period) => (
          <button
            key={period.id}
            type="button"
            onClick={() => setPeriodId(period.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
              periodId === period.id
                ? "bg-primary text-primary-foreground"
                : "bg-sky-50 text-sky-900 hover:bg-sky-100"
            )}
          >
            {period.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <AlertsTrendChart data={reportData.alertsTrend} />
        <ComplianceTrendChart data={reportData.complianceTrend} />
        <AlertsByDepartmentChart data={reportData.alertsByDepartment} />
        <SeverityDistributionChart data={reportData.severityDistribution} />
        <EventDurationChart data={reportData.eventResolutionBuckets} />
        <AlertsByDeviceTypeChart data={reportData.alertsByDeviceType} />
      </div>
    </div>
  )
}
