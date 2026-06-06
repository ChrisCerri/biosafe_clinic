import { createContext, useContext, useMemo } from "react"
import {
  buildAnomalyTimelineFromEvents,
  getAnomalyEvents,
  getLastAlertFromEvents,
  getMonitoringDevices,
} from "@/lib/clinicData"
import {
  ALERT_STATUS,
  getClinicStatus,
  getDeviceCounts,
  getMostCriticalDepartment,
  splitDevicesByStatus,
} from "@/lib/alertEngine"

const MonitoringContext = createContext(null)

export function MonitoringProvider({ children }) {
  const allEvaluated = useMemo(() => getMonitoringDevices(), [])

  const { criticalDevices, warningDevices, okDevices } = useMemo(() => {
    return splitDevicesByStatus(allEvaluated)
  }, [allEvaluated])

  const baseCounts = getDeviceCounts(allEvaluated)
  const counts = {
    total: baseCounts.total,
    ok: baseCounts.ok,
    warning: baseCounts.warning,
    critical: baseCounts.critical,
    activeAlerts: baseCounts.warning + baseCounts.critical,
  }

  const clinicStatus = {
    ...getClinicStatus({
      total: counts.total,
      ok: counts.ok,
      warning: counts.warning,
      critical: counts.critical,
    }),
    updatedAt: allEvaluated[0]?.updatedAt ?? "—",
  }

  const anomalyEvents = useMemo(() => getAnomalyEvents(), [])

  const mostCriticalDepartment = getMostCriticalDepartment(allEvaluated)
  const lastAlert = getLastAlertFromEvents(anomalyEvents)
  const anomalyTimeline = buildAnomalyTimelineFromEvents(anomalyEvents)

  const departmentsData = useMemo(() => {
    const grouped = {}

    allEvaluated.forEach((device) => {
      if (!grouped[device.department]) {
        grouped[device.department] = {
          name: device.department,
          devices: [],
          critical: 0,
          warning: 0,
          ok: 0,
        }
      }

      grouped[device.department].devices.push(device)

      if (device.overallStatus === ALERT_STATUS.CRITICAL) grouped[device.department].critical += 1
      else if (device.overallStatus === ALERT_STATUS.WARNING) grouped[device.department].warning += 1
      else grouped[device.department].ok += 1
    })

    return Object.values(grouped).map((department) => ({
      ...department,
      devices: department.devices.sort(
        (a, b) =>
          (b.overallStatus === ALERT_STATUS.CRITICAL ? 2 : b.overallStatus === ALERT_STATUS.WARNING ? 1 : 0) -
          (a.overallStatus === ALERT_STATUS.CRITICAL ? 2 : a.overallStatus === ALERT_STATUS.WARNING ? 1 : 0)
      ),
    }))
  }, [allEvaluated])

  const value = {
    allEvaluated,
    criticalDevices,
    warningDevices,
    okDevices,
    activeCritical: criticalDevices,
    activeWarnings: warningDevices,
    counts,
    clinicStatus,
    mostCriticalDepartment,
    lastAlert,
    anomalyTimeline,
    departmentsData,
  }

  return <MonitoringContext.Provider value={value}>{children}</MonitoringContext.Provider>
}

export function useMonitoring() {
  const context = useContext(MonitoringContext)
  if (!context) {
    throw new Error("useMonitoring must be used within MonitoringProvider")
  }
  return context
}
