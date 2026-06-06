import { DEVICE_TYPE_LABELS, PARAMETER_LABELS } from "./deviceThresholds"

export const ALERT_STATUS = {
  OK: "ok",
  WARNING: "warning",
  CRITICAL: "critical",
}

const STATUS_WEIGHT = {
  [ALERT_STATUS.OK]: 0,
  [ALERT_STATUS.WARNING]: 1,
  [ALERT_STATUS.CRITICAL]: 2,
}

function maxStatus(a, b) {
  return STATUS_WEIGHT[a] >= STATUS_WEIGHT[b] ? a : b
}

function evaluateBioTemperature(value) {
  if (value < 35 || value > 39) return ALERT_STATUS.CRITICAL
  if (value < 36 || value > 38) return ALERT_STATUS.WARNING
  return ALERT_STATUS.OK
}

function evaluateCryoTemperature(value) {
  if (value > -190) return ALERT_STATUS.CRITICAL
  if (value > -194) return ALERT_STATUS.WARNING
  return ALERT_STATUS.OK
}

function evaluateHvacTemperature(value) {
  if (value < 18 || value > 25) return ALERT_STATUS.CRITICAL
  if (value < 19 || value > 23) return ALERT_STATUS.WARNING
  return ALERT_STATUS.OK
}

function evaluateIncVibration(value) {
  if (value > 1.0) return ALERT_STATUS.CRITICAL
  if (value >= 0.6) return ALERT_STATUS.WARNING
  return ALERT_STATUS.OK
}

function evaluateCellVibration(value) {
  if (value > 0.8) return ALERT_STATUS.CRITICAL
  if (value >= 0.4) return ALERT_STATUS.WARNING
  return ALERT_STATUS.OK
}

function evaluateCryoVibration(value) {
  if (value > 1.0) return ALERT_STATUS.CRITICAL
  if (value >= 0.5) return ALERT_STATUS.WARNING
  return ALERT_STATUS.OK
}

function evaluateHvacVibration(value) {
  if (value > 2.0) return ALERT_STATUS.CRITICAL
  if (value >= 1.2) return ALERT_STATUS.WARNING
  return ALERT_STATUS.OK
}

function evaluateNitrogen(value) {
  if (value < 25) return ALERT_STATUS.CRITICAL
  if (value < 40) return ALERT_STATUS.WARNING
  return ALERT_STATUS.OK
}

function formatValue(parameter, value) {
  if (parameter === "temperature") return `${value}°C`
  if (parameter === "vibration") return `${value} mm/s`
  if (parameter === "nitrogen") return `${value}%`
  return String(value)
}

function buildMessage(deviceType, parameter, status, value) {
  const label = PARAMETER_LABELS[parameter]
  const formatted = formatValue(parameter, value)

  if (parameter === "nitrogen") {
    if (status === ALERT_STATUS.CRITICAL) {
      return `Il ${label.toLowerCase()} è troppo basso (${formatted}). Rischio campioni irreversibile.`
    }
    if (status === ALERT_STATUS.WARNING) {
      return `Il ${label.toLowerCase()} si sta avvicinando alla soglia critica (${formatted}).`
    }
  }

  if (parameter === "temperature" && deviceType === "CRYO") {
    if (status === ALERT_STATUS.CRITICAL) {
      return `La temperatura criogenica è troppo alta (${formatted}). I campioni non sono sufficientemente protetti.`
    }
    if (status === ALERT_STATUS.WARNING) {
      return `La temperatura criogenica è in aumento (${formatted}). Verifica il sistema di raffreddamento.`
    }
  }

  if (parameter === "temperature") {
    if (status === ALERT_STATUS.CRITICAL) {
      return `La temperatura è fuori controllo (${formatted}). Verifica subito il campione e il setpoint.`
    }
    if (status === ALERT_STATUS.WARNING) {
      return `La temperatura è fuori dal range abituale (${formatted}).`
    }
  }

  if (parameter === "vibration") {
    if (status === ALERT_STATUS.CRITICAL) {
      return `Vibrazione critica rilevata (${formatted}). Possibile guasto meccanico.`
    }
    if (status === ALERT_STATUS.WARNING) {
      return `Trend in peggioramento — vibrazione elevata (${formatted}).`
    }
  }

  return `${label} nella norma (${formatted}).`
}

function recommendedAction(parameter, status) {
  if (status === ALERT_STATUS.OK) return "Nessuna azione richiesta."

  if (parameter === "nitrogen") {
    return status === ALERT_STATUS.CRITICAL
      ? "Ricaricare azoto e verificare perdita immediatamente."
      : "Verifica sensore e pianifica ricarica."
  }

  if (parameter === "temperature") {
    return status === ALERT_STATUS.CRITICAL
      ? "Verifica subito il campione, il setpoint e il sistema di raffreddamento."
      : "Controlla ora le condizioni del dispositivo e del locale."
  }

  if (parameter === "vibration") {
    return status === ALERT_STATUS.CRITICAL
      ? "Ferma il macchinario se possibile e chiama manutenzione."
      : "Programma controllo manutentivo entro oggi."
  }

  return "Controlla ora il dispositivo."
}

function evaluateParameter(deviceType, parameter, value) {
  if (value == null) return ALERT_STATUS.OK

  if (parameter === "temperature") {
    if (deviceType === "CRYO") return evaluateCryoTemperature(value)
    if (deviceType === "HVAC") return evaluateHvacTemperature(value)
    return evaluateBioTemperature(value)
  }

  if (parameter === "vibration") {
    if (deviceType === "INC") return evaluateIncVibration(value)
    if (deviceType === "CELL") return evaluateCellVibration(value)
    if (deviceType === "CRYO") return evaluateCryoVibration(value)
    if (deviceType === "HVAC") return evaluateHvacVibration(value)
  }

  if (parameter === "nitrogen") return evaluateNitrogen(value)

  return ALERT_STATUS.OK
}

function getPriority(status, parameter) {
  if (status === ALERT_STATUS.CRITICAL) {
    if (parameter === "nitrogen") return "P1"
    return "P2"
  }
  if (status === ALERT_STATUS.WARNING) return "P3"
  return null
}

export function evaluateDevice(device) {
  const parameters = ["temperature", "vibration"]
  if (device.type === "CRYO") parameters.push("nitrogen")

  const alerts = parameters
    .filter((parameter) => device.readings[parameter] != null)
    .map((parameter) => {
      const value = device.readings[parameter]
      const status = evaluateParameter(device.type, parameter, value)

      return {
        parameter,
        parameterLabel: PARAMETER_LABELS[parameter],
        status,
        value,
        formattedValue: formatValue(parameter, value),
        message: buildMessage(device.type, parameter, status, value),
        action: recommendedAction(parameter, status),
        priority: getPriority(status, parameter),
      }
    })

  const overallStatus = alerts.reduce(
    (current, alert) => maxStatus(current, alert.status),
    ALERT_STATUS.OK
  )

  const activeAlerts = alerts.filter((alert) => alert.status !== ALERT_STATUS.OK)
  const primaryAlert =
    activeAlerts.sort((a, b) => STATUS_WEIGHT[b.status] - STATUS_WEIGHT[a.status])[0] ?? null

  return {
    ...device,
    typeLabel: DEVICE_TYPE_LABELS[device.type],
    alerts,
    activeAlerts,
    overallStatus,
    priority: primaryAlert?.priority ?? null,
    problem: primaryAlert?.message ?? "Tutti i parametri nella norma.",
    action: primaryAlert?.action ?? "Nessuna azione richiesta.",
    risk:
      overallStatus === ALERT_STATUS.CRITICAL
        ? "Campioni a rischio — intervento immediato"
        : overallStatus === ALERT_STATUS.WARNING
          ? "Monitoraggio operativo consigliato"
          : null,
    timeToCritical:
      primaryAlert?.parameter === "nitrogen" && primaryAlert.status !== ALERT_STATUS.OK
        ? primaryAlert.status === ALERT_STATUS.CRITICAL
          ? "~45 min"
          : "~6 ore"
        : primaryAlert?.status === ALERT_STATUS.CRITICAL
          ? "~2 ore"
          : primaryAlert?.status === ALERT_STATUS.WARNING
            ? "~8 ore"
            : null,
  }
}

export function evaluateDevices(devices) {
  return devices.map(evaluateDevice)
}

export function getDeviceCounts(devices) {
  const evaluated = evaluateDevices(devices)

  return {
    total: evaluated.length,
    ok: evaluated.filter((device) => device.overallStatus === ALERT_STATUS.OK).length,
    warning: evaluated.filter((device) => device.overallStatus === ALERT_STATUS.WARNING).length,
    critical: evaluated.filter((device) => device.overallStatus === ALERT_STATUS.CRITICAL).length,
  }
}

export function getClinicStatus(counts) {
  if (counts.critical > 0) {
    return {
      level: "CRITICO",
      label: "Stato Clinica: CRITICO",
      summary: `${counts.critical} dispositivi richiedono intervento immediato. Controlla i reparti critici.`,
    }
  }

  if (counts.warning > 0) {
    return {
      level: "ATTENZIONE",
      label: "Stato Clinica: ATTENZIONE",
      summary: `${counts.warning} warning attivi. Nessun allarme critico al momento.`,
    }
  }

  return {
    level: "OK",
    label: "Stato Clinica: OK",
    summary: "Tutti i dispositivi sono nella norma. Nessun intervento richiesto.",
  }
}

export function getMostCriticalDepartment(devices) {
  const evaluated = evaluateDevices(devices)
  const departments = {}

  evaluated.forEach((device) => {
    if (!departments[device.department]) {
      departments[device.department] = {
        name: device.department,
        critical: 0,
        warning: 0,
        ok: 0,
        score: 0,
        lastAnomaly: null,
      }
    }

    const dept = departments[device.department]

    if (device.overallStatus === ALERT_STATUS.CRITICAL) {
      dept.critical += 1
      dept.score += 2
    } else if (device.overallStatus === ALERT_STATUS.WARNING) {
      dept.warning += 1
      dept.score += 1
    } else {
      dept.ok += 1
    }

    if (device.overallStatus !== ALERT_STATUS.OK) {
      dept.lastAnomaly = `${device.id} — ${device.problem}`
    }
  })

  const ranked = Object.values(departments).sort((a, b) => b.score - a.score)
  return ranked[0] ?? null
}

export function getLastAlert(devices) {
  const evaluated = evaluateDevices(devices)
  const alerts = evaluated
    .filter((device) => device.overallStatus !== ALERT_STATUS.OK)
    .sort((a, b) => STATUS_WEIGHT[b.overallStatus] - STATUS_WEIGHT[a.overallStatus])

  const device = alerts[0]
  if (!device) return null

  return {
    device: device.id,
    department: device.department,
    priority: device.priority,
    message: device.problem,
    detectedAt: device.updatedAt,
    timeToCritical: device.timeToCritical,
    action: device.action,
  }
}

export function splitDevicesByStatus(devices) {
  const evaluated = evaluateDevices(devices)

  return {
    criticalDevices: evaluated.filter((device) => device.overallStatus === ALERT_STATUS.CRITICAL),
    warningDevices: evaluated.filter((device) => device.overallStatus === ALERT_STATUS.WARNING),
    okDevices: evaluated.filter((device) => device.overallStatus === ALERT_STATUS.OK),
    allEvaluated: evaluated,
  }
}

export function buildAnomalyTimeline(devices) {
  return evaluateDevices(devices)
    .flatMap((device, index) =>
      device.activeAlerts.map((alert, alertIndex) => ({
        id: `${device.id}-${alert.parameter}-${index}-${alertIndex}`,
        time: device.updatedAt.split(", ")[1] ?? device.updatedAt,
        device: device.id,
        department: device.department,
        severity: alert.status,
        message: alert.message,
      }))
    )
    .slice(0, 8)
}
