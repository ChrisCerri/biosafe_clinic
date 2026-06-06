export const ALERT_STATUS = {
  OK: "ok",
  WARNING: "warning",
  CRITICAL: "critical",
}

export function getDeviceCounts(devices) {
  return {
    total: devices.length,
    ok: devices.filter((device) => device.overallStatus === ALERT_STATUS.OK).length,
    warning: devices.filter((device) => device.overallStatus === ALERT_STATUS.WARNING).length,
    critical: devices.filter((device) => device.overallStatus === ALERT_STATUS.CRITICAL).length,
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
  const departments = {}

  devices.forEach((device) => {
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

export function splitDevicesByStatus(devices) {
  return {
    criticalDevices: devices.filter((device) => device.overallStatus === ALERT_STATUS.CRITICAL),
    warningDevices: devices.filter((device) => device.overallStatus === ALERT_STATUS.WARNING),
    okDevices: devices.filter((device) => device.overallStatus === ALERT_STATUS.OK),
    allEvaluated: devices,
  }
}
