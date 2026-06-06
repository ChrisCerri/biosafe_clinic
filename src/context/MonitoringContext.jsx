import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { SCENARIO_IDS } from "@/data/dashboardScenarios"
import { getScenarioDevices } from "@/data/deviceReadings"
import {
  ALERT_STATUS,
  buildAnomalyTimeline,
  getClinicStatus,
  getDeviceCounts,
  getLastAlert,
  getMostCriticalDepartment,
  splitDevicesByStatus,
} from "@/lib/alertEngine"
import { TICKET_STATUS, createInitialTicketState } from "@/lib/ticketStatus"

const MonitoringContext = createContext(null)

export function MonitoringProvider({ children }) {
  const [scenarioId, setScenarioId] = useState(SCENARIO_IDS.HIGH)
  const [ticketStates, setTicketStates] = useState({})
  const [ticketClosures, setTicketClosures] = useState({})
  const [openConfirmTicketId, setOpenConfirmTicketId] = useState(null)
  const [closeTicketId, setCloseTicketId] = useState(null)

  const devices = useMemo(() => getScenarioDevices(scenarioId), [scenarioId])

  const { criticalDevices, warningDevices, okDevices, allEvaluated } = useMemo(
    () => splitDevicesByStatus(devices),
    [devices]
  )

  const alertDevices = useMemo(
    () => [...criticalDevices, ...warningDevices],
    [criticalDevices, warningDevices]
  )

  const alertDeviceIds = useMemo(
    () => alertDevices.map((device) => device.id).join(","),
    [alertDevices]
  )

  useEffect(() => {
    setTicketStates(createInitialTicketState(alertDevices))
    setTicketClosures({})
    setOpenConfirmTicketId(null)
    setCloseTicketId(null)
  }, [scenarioId, alertDeviceIds, alertDevices])

  const takeCharge = (ticketId) => {
    setTicketStates((current) => ({
      ...current,
      [ticketId]: TICKET_STATUS.IN_PROGRESS,
    }))
  }

  const closeTicket = (ticketId, closure) => {
    setTicketStates((current) => ({
      ...current,
      [ticketId]: TICKET_STATUS.CLOSED,
    }))
    setTicketClosures((current) => ({
      ...current,
      [ticketId]: closure,
    }))
  }

  const activeCritical = criticalDevices.filter(
    (device) => ticketStates[device.id] !== TICKET_STATUS.CLOSED
  )
  const activeWarnings = warningDevices.filter(
    (device) => ticketStates[device.id] !== TICKET_STATUS.CLOSED
  )
  const resolvedTickets = alertDevices.filter(
    (device) => ticketStates[device.id] === TICKET_STATUS.CLOSED
  )

  const baseCounts = getDeviceCounts(devices)
  const counts = {
    total: baseCounts.total,
    ok: baseCounts.ok + resolvedTickets.length,
    warning: activeWarnings.length,
    critical: activeCritical.length,
    activeAlerts: activeCritical.length + activeWarnings.length,
  }

  const clinicStatus = {
    ...getClinicStatus(baseCounts),
    updatedAt: "05/06/2026, 16:42",
  }

  const mostCriticalDepartment = getMostCriticalDepartment(devices)
  const lastAlert = getLastAlert(devices)
  const anomalyTimeline = buildAnomalyTimeline(devices)

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
    scenarioId,
    setScenarioId,
    devices,
    allEvaluated,
    criticalDevices,
    warningDevices,
    okDevices,
    activeCritical,
    activeWarnings,
    resolvedTickets,
    counts,
    clinicStatus,
    mostCriticalDepartment,
    lastAlert,
    anomalyTimeline,
    departmentsData,
    ticketStates,
    ticketClosures,
    openConfirmTicketId,
    closeTicketId,
    setOpenConfirmTicketId,
    setCloseTicketId,
    takeCharge,
    closeTicket,
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
