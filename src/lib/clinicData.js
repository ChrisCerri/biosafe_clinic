import deviceSummary from "../../eda_device_summary.json"
import anomalyCases from "../../eda_anomaly_cases.json"
import anomalyEvents from "../../eda_anomaly_events.json"
import sensorReadings from "../../sensor_readings_enriched.json"
import { ALERT_STATUS } from "@/lib/alertEngine"
import { DEVICE_TYPE_LABELS, PARAMETER_LABELS } from "@/lib/deviceThresholds"

export const DATA_FILES = {
  deviceSummary: "eda_device_summary.json",
  anomalyCases: "eda_anomaly_cases.json",
  anomalyEvents: "eda_anomaly_events.json",
  sensorReadings: "sensor_readings_enriched.json",
}

const DATASET_END = sensorReadings.reduce((max, reading) => {
  const date = new Date(reading.timestamp)
  return date > max ? date : max
}, new Date(0))

const DATASET_START = sensorReadings.reduce((min, reading) => {
  const date = new Date(reading.timestamp)
  return date < min ? date : min
}, new Date("2099-01-01"))

const DEPARTMENT_MAP = {
  Laboratorio_A: "Laboratorio A",
  Laboratorio_B: "Laboratorio B",
  Deposito_C: "Deposito C",
  Edificio_Principale: "Edificio Principale",
}

const DEVICE_TYPE_MAP = {
  incubatore: "INC",
  cella_coltura: "CELL",
  banca_criogenica: "CRYO",
  hvac: "HVAC",
}

export function mapDepartment(reparto) {
  return DEPARTMENT_MAP[reparto] ?? reparto.replaceAll("_", " ")
}

export function mapDeviceType(deviceType) {
  return DEVICE_TYPE_MAP[deviceType] ?? deviceType
}

export const DEPARTMENTS = [
  ...new Set(deviceSummary.map((item) => mapDepartment(item.reparto))),
].sort()

const PARAMETER_MAP = {
  temperatura: "temperature",
  vibrazione: "vibration",
  livello_azoto: "nitrogen",
}

const STATUS_WEIGHT = {
  [ALERT_STATUS.OK]: 0,
  [ALERT_STATUS.WARNING]: 1,
  [ALERT_STATUS.CRITICAL]: 2,
}

export const reportPeriods = [
  { id: "7d", label: "Ultimi 7 giorni" },
  { id: "30d", label: "Ultimi 30 giorni" },
  { id: "90d", label: "Ultimi 90 giorni" },
  { id: "12m", label: "Ultimi 12 mesi" },
]

export const CHART_COLORS = {
  critical: "#dc2626",
  warning: "#d97706",
  ok: "#059669",
  primary: "#0284c7",
  muted: "#64748b",
}

function formatUpdatedAt(iso) {
  return new Date(iso).toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatEventTime(iso) {
  return new Date(iso).toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function computeLatestReadings(readings) {
  const latest = {}

  readings.forEach((reading) => {
    if (!latest[reading.device_id] || reading.timestamp > latest[reading.device_id].timestamp) {
      latest[reading.device_id] = reading
    }
  })

  return Object.values(latest)
}

function getPeriodStart(periodId) {
  const days = { "7d": 7, "30d": 30, "90d": 90, "12m": 365 }[periodId] ?? 30
  const start = new Date(DATASET_END)
  start.setDate(start.getDate() - days + 1)
  start.setHours(0, 0, 0, 0)
  return start
}

function filterEventsByPeriod(events, periodId) {
  const start = getPeriodStart(periodId)
  return events.filter((event) => new Date(event.start_time) >= start)
}

function filterReadingsByPeriod(readings, periodId) {
  const start = getPeriodStart(periodId)
  return readings.filter((reading) => new Date(reading.timestamp) >= start)
}

function computeComplianceTrend(readings) {
  const daily = {}

  readings.forEach((reading) => {
    const day = reading.date.slice(0, 10)
    if (!daily[day]) daily[day] = { ok: 0, total: 0 }
    daily[day].total += 1
    if (reading.computed_status === "OK") daily[day].ok += 1
  })

  return Object.entries(daily)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, value]) => ({
      date: day,
      label: `${day.slice(8, 10)}/${day.slice(5, 7)}`,
      compliance: Math.round((value.ok / value.total) * 1000) / 10,
    }))
}

function computeAlertsTrend(events) {
  const weeks = {}

  events.forEach((event) => {
    const date = new Date(event.start_time)
    const monday = new Date(date)
    monday.setDate(date.getDate() - ((date.getDay() + 6) % 7))
    const key = monday.toISOString().slice(0, 10)

    if (!weeks[key]) {
      weeks[key] = { date: key, label: `Sett. ${key.slice(8, 10)}`, critical: 0, warning: 0 }
    }

    if (event.severity === "CRITICAL") weeks[key].critical += 1
    else if (event.severity === "WARNING") weeks[key].warning += 1
  })

  return Object.values(weeks).sort((a, b) => a.date.localeCompare(b.date))
}

function computeResolutionBuckets(events) {
  const buckets = {
    "< 2 ore": 0,
    "2–8 ore": 0,
    "8–24 ore": 0,
    "> 24 ore": 0,
  }

  events.forEach((event) => {
    const hours = event.duration_minutes / 60
    if (hours < 2) buckets["< 2 ore"] += 1
    else if (hours < 8) buckets["2–8 ore"] += 1
    else if (hours < 24) buckets["8–24 ore"] += 1
    else buckets["> 24 ore"] += 1
  })

  return Object.entries(buckets).map(([range, count]) => ({ range, count }))
}

function computeSeverityDistribution(readings) {
  const totals = { OK: 0, WARNING: 0, CRITICAL: 0, WATCH: 0 }

  readings.forEach((reading) => {
    const status = reading.computed_status ?? reading.stato_dispositivo ?? "OK"
    if (status in totals) totals[status] += 1
    else totals.OK += 1
  })

  return [
    { name: "Critical", value: totals.CRITICAL, color: CHART_COLORS.critical },
    { name: "Warning", value: totals.WARNING, color: CHART_COLORS.warning },
    { name: "OK", value: totals.OK, color: CHART_COLORS.ok },
  ]
}

function mapJsonStatus(status) {
  const value = (status ?? "OK").toUpperCase()
  if (value === "CRITICAL") return ALERT_STATUS.CRITICAL
  if (value === "WARNING" || value === "WATCH") return ALERT_STATUS.WARNING
  return ALERT_STATUS.OK
}

function getCaseSeverityLabel(caseItem) {
  if (!caseItem) return "OK"
  if (caseItem.critical_readings > 0) return "CRITICAL"
  if (caseItem.warning_readings > 0) return "WARNING"
  return "WATCH"
}

function maxOverallStatus(currentStatus, nextStatus) {
  return STATUS_WEIGHT[currentStatus] >= STATUS_WEIGHT[nextStatus] ? currentStatus : nextStatus
}

function formatParamValue(parameter, value) {
  if (parameter === "temperature") return `${value}°C`
  if (parameter === "vibration") return `${value} mm/s`
  if (parameter === "nitrogen") return `${value}%`
  return String(value)
}

function priorityFromStatus(status, parameter) {
  if (status === ALERT_STATUS.CRITICAL) return parameter === "nitrogen" ? "P1" : "P2"
  if (status === ALERT_STATUS.WARNING) return "P3"
  return null
}

function buildParameterMessage(parameterLabel, status, formattedValue, jsonStatus) {
  if (status === ALERT_STATUS.OK) {
    return `${parameterLabel} nella norma (${formattedValue}).`
  }

  return `${parameterLabel}: ${formattedValue} (${jsonStatus})`
}

function formatDuration(minutes) {
  if (minutes >= 60) {
    return `${Math.round((minutes / 60) * 10) / 10} h`
  }

  return `${minutes} min`
}

function evaluateDeviceFromReading(reading, caseItem, latestEvent) {
  const deviceType = mapDeviceType(reading.device_type)
  const parameterDefs = [
    {
      key: "temperature",
      jsonKey: "temperatura",
      statusKey: "temp_status",
      label: PARAMETER_LABELS.temperature,
    },
    {
      key: "vibration",
      jsonKey: "vibrazione",
      statusKey: "vib_status",
      label: PARAMETER_LABELS.vibration,
    },
  ]

  if (reading.livello_azoto != null) {
    parameterDefs.push({
      key: "nitrogen",
      jsonKey: "livello_azoto",
      statusKey: "azoto_status",
      label: PARAMETER_LABELS.nitrogen,
    })
  }

  const alerts = parameterDefs
    .filter((parameter) => reading[parameter.jsonKey] != null)
    .map((parameter) => {
      const status = mapJsonStatus(reading[parameter.statusKey])
      const value = reading[parameter.jsonKey]
      const formattedValue = formatParamValue(parameter.key, value)

      return {
        parameter: parameter.key,
        parameterLabel: parameter.label,
        status,
        value,
        formattedValue,
        message: buildParameterMessage(
          parameter.label,
          status,
          formattedValue,
          reading[parameter.statusKey]
        ),
        action:
          caseItem && status !== ALERT_STATUS.OK
            ? `Caso ${caseItem.case_id}: ${caseItem.title}`
            : status === ALERT_STATUS.OK
              ? "Nessuna azione richiesta."
              : "Verifica dispositivo.",
        priority: priorityFromStatus(status, parameter.key),
      }
    })

  const readingStatus = mapJsonStatus(reading.computed_status ?? reading.stato_dispositivo)
  const caseStatus = mapJsonStatus(getCaseSeverityLabel(caseItem))
  const overallStatus = maxOverallStatus(readingStatus, caseStatus)
  const activeAlerts = alerts.filter((alert) => alert.status !== ALERT_STATUS.OK)
  const primaryAlert =
    activeAlerts.sort((a, b) => STATUS_WEIGHT[b.status] - STATUS_WEIGHT[a.status])[0] ?? null
  const primaryParameter =
    primaryAlert?.parameter ?? PARAMETER_MAP[caseItem?.main_parameter] ?? "temperature"

  const problem =
    overallStatus === ALERT_STATUS.OK
      ? "Tutti i parametri nella norma."
      : caseItem?.plain_language_alert ??
        primaryAlert?.message ??
        "Parametro fuori soglia."

  const action =
    overallStatus === ALERT_STATUS.OK
      ? "Nessuna azione richiesta."
      : caseItem
        ? `Analizza caso ${caseItem.case_id}: ${caseItem.title}`
        : primaryAlert?.action ?? "Verifica dispositivo."

  const timeToCritical =
    latestEvent && overallStatus !== ALERT_STATUS.OK
      ? formatDuration(latestEvent.duration_minutes)
      : null

  return {
    id: reading.device_id,
    type: deviceType,
    typeLabel: DEVICE_TYPE_LABELS[deviceType],
    department: mapDepartment(reading.reparto),
    readings: {
      temperature: reading.temperatura,
      vibration: reading.vibrazione,
      ...(reading.livello_azoto != null ? { nitrogen: reading.livello_azoto } : {}),
    },
    updatedAt: formatUpdatedAt(reading.timestamp),
    sensorStatus: reading.computed_status ?? reading.stato_dispositivo,
    alerts,
    activeAlerts,
    overallStatus,
    priority:
      overallStatus !== ALERT_STATUS.OK
        ? priorityFromStatus(overallStatus, primaryParameter)
        : null,
    problem,
    action,
    risk:
      overallStatus === ALERT_STATUS.CRITICAL
        ? caseItem?.plain_language_alert ?? "Intervento immediato"
        : overallStatus === ALERT_STATUS.WARNING
          ? "Monitoraggio consigliato"
          : null,
    timeToCritical,
    ...(caseItem && overallStatus !== ALERT_STATUS.OK
      ? { caseId: caseItem.case_id, caseTitle: caseItem.title }
      : {}),
  }
}

const latestSensorReadings = computeLatestReadings(sensorReadings)

const departmentByDeviceId = Object.fromEntries(
  deviceSummary.map((item) => [item.device_id, mapDepartment(item.reparto)])
)

const typeByDeviceId = Object.fromEntries(
  deviceSummary.map((item) => [item.device_id, mapDeviceType(item.device_type)])
)

const casesByDeviceId = Object.fromEntries(anomalyCases.map((item) => [item.device_id, item]))

const latestEventByDeviceId = [...anomalyEvents]
  .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
  .reduce((events, event) => {
    if (!events[event.device_id]) {
      events[event.device_id] = event
    }
    return events
  }, {})

export const TOTAL_DEVICES = deviceSummary.length

export function getMonitoringDevices() {
  return latestSensorReadings.map((reading) =>
    evaluateDeviceFromReading(
      reading,
      casesByDeviceId[reading.device_id],
      latestEventByDeviceId[reading.device_id]
    )
  )
}

export function getDeviceSummary() {
  return deviceSummary.map((item) => ({
    ...item,
    department: mapDepartment(item.reparto),
    type: mapDeviceType(item.device_type),
    typeLabel: DEVICE_TYPE_LABELS[mapDeviceType(item.device_type)],
  }))
}

export function getAnomalyCases() {
  return anomalyCases.map((item) => {
    const severity =
      item.critical_readings > 0
        ? "CRITICAL"
        : item.warning_readings > 0
          ? "WARNING"
          : "WATCH"

    return {
      ...item,
      severity,
      department: departmentByDeviceId[item.device_id] ?? "—",
      deviceType: typeByDeviceId[item.device_id] ?? "INC",
      typeLabel: DEVICE_TYPE_LABELS[typeByDeviceId[item.device_id] ?? "INC"],
      periodStartLabel: formatEventTime(item.period_start),
      periodEndLabel: formatEventTime(item.period_end),
    }
  })
}

export function getAnomalyEvents() {
  return [...anomalyEvents]
    .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
    .map((event, index) => ({
      ...event,
      id: `${event.device_id}-${event.start_time}-${index}`,
      department: mapDepartment(event.reparto),
      deviceType: mapDeviceType(event.device_type),
      typeLabel: DEVICE_TYPE_LABELS[mapDeviceType(event.device_type)],
      parameter: PARAMETER_MAP[event.main_parameter] ?? event.main_parameter,
      parameterLabel: event.main_parameter.replaceAll("_", " "),
      severity: event.severity.toLowerCase(),
      startLabel: formatEventTime(event.start_time),
      endLabel: formatEventTime(event.end_time),
      durationHours: Math.round((event.duration_minutes / 60) * 10) / 10,
    }))
}

export function getSensorReadingsForDevice(deviceId) {
  return sensorReadings.filter((reading) => reading.device_id === deviceId)
}

export function buildAnomalyTimelineFromEvents(events, limit = 8) {
  return events.slice(0, limit).map((event) => ({
    id: event.id,
    time: event.startLabel.split(", ")[1] ?? event.startLabel,
    device: event.device_id,
    department: event.department,
    severity: event.severity,
    message: `${event.parameterLabel}: ${event.min_value} – ${event.max_value}`,
  }))
}

export function getLastAlertFromEvents(events) {
  const event = events.find((item) => item.severity === "critical") ?? events[0]
  if (!event) return null

  const caseItem = casesByDeviceId[event.device_id]

  return {
    device: event.device_id,
    department: event.department,
    priority: event.severity === "critical" ? "P1" : "P3",
    message:
      caseItem?.plain_language_alert ??
      `${event.parameterLabel} fuori soglia (${event.min_value} – ${event.max_value})`,
    detectedAt: event.startLabel,
    timeToCritical: formatDuration(event.duration_minutes),
    action: caseItem ? `Caso ${caseItem.case_id}: ${caseItem.title}` : "Verifica dispositivo e reparto.",
  }
}

function aggregateByDepartment(events) {
  const grouped = {}

  events.forEach((event) => {
    const department = mapDepartment(event.reparto)
    if (!grouped[department]) {
      grouped[department] = { department, critical: 0, warning: 0 }
    }
    if (event.severity === "CRITICAL") grouped[department].critical += 1
    else if (event.severity === "WARNING") grouped[department].warning += 1
  })

  return Object.values(grouped)
}

function aggregateByDeviceType(events) {
  const grouped = {}

  events.forEach((event) => {
    const type = mapDeviceType(event.device_type)
    const label = DEVICE_TYPE_LABELS[type]
    if (!grouped[type]) {
      grouped[type] = { type, label, critical: 0, warning: 0 }
    }
    if (event.severity === "CRITICAL") grouped[type].critical += 1
    else if (event.severity === "WARNING") grouped[type].warning += 1
  })

  return Object.values(grouped)
}

export function getReportData(periodId) {
  const period = reportPeriods.some((item) => item.id === periodId) ? periodId : "30d"
  const periodEvents = filterEventsByPeriod(anomalyEvents, period)
  const periodReadings = filterReadingsByPeriod(sensorReadings, period)

  const totalAlerts = periodEvents.length
  const avgResolutionHours =
    periodEvents.length === 0
      ? 0
      : Math.round(
          (periodEvents.reduce((sum, event) => sum + event.duration_minutes, 0) /
            periodEvents.length /
            60) *
            10
        ) / 10

  const totalReadings = periodReadings.length
  const totalOk = periodReadings.filter((reading) => reading.computed_status === "OK").length
  const compliancePercent =
    totalReadings === 0 ? 0 : Math.round((totalOk / totalReadings) * 1000) / 10

  const openCases = getAnomalyCases().filter((item) => item.severity !== "WATCH").length

  return {
    summary: {
      totalAlerts,
      avgResolutionHours,
      compliancePercent,
      openCases: openCases,
    },
    alertsTrend: computeAlertsTrend(periodEvents),
    complianceTrend: computeComplianceTrend(periodReadings),
    alertsByDepartment: aggregateByDepartment(periodEvents),
    severityDistribution: computeSeverityDistribution(periodReadings),
    eventResolutionBuckets: computeResolutionBuckets(periodEvents),
    alertsByDeviceType: aggregateByDeviceType(periodEvents),
  }
}

export function getCaseByDeviceId(deviceId) {
  return getAnomalyCases().find((item) => item.device_id === deviceId)
}

export function getEventsByDeviceId(deviceId) {
  return getAnomalyEvents().filter((item) => item.device_id === deviceId)
}

const datasetMonthLabel = DATASET_START.toLocaleString("it-IT", {
  month: "long",
  year: "numeric",
})

export const DATA_SOURCE_LABEL = `Dataset BioSafe — ${
  datasetMonthLabel.charAt(0).toUpperCase() + datasetMonthLabel.slice(1)
}`

export function getDatasetMeta() {
  return {
    devices: TOTAL_DEVICES,
    sensorReadings: sensorReadings.length,
    anomalyEvents: anomalyEvents.length,
    anomalyCases: anomalyCases.length,
    datasetEnd: formatUpdatedAt(DATASET_END.toISOString()),
  }
}
