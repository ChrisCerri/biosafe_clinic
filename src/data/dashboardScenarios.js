export const SCENARIO_IDS = {
  NONE: "none",
  MEDIUM: "medium",
  HIGH: "high",
}

export const scenarioOptions = [
  {
    id: SCENARIO_IDS.NONE,
    label: "Nessun problema",
    description: "Tutti i dispositivi operativi",
  },
  {
    id: SCENARIO_IDS.MEDIUM,
    label: "Media criticità",
    description: "Warning attivi, nessun allarme critico",
  },
  {
    id: SCENARIO_IDS.HIGH,
    label: "Alta criticità",
    description: "Allarmi P1/P2 e warning multipli",
  },
]

const baseOkDevicesCount = 19

export const dashboardScenarios = {
  [SCENARIO_IDS.NONE]: {
    clinicStatus: {
      level: "OK",
      label: "Stato Clinica: OK",
      summary: "Tutti i dispositivi sono nella norma. Nessun intervento richiesto.",
      updatedAt: "05/06/2026, 16:42",
    },
    deviceCounts: {
      ok: baseOkDevicesCount,
      warning: 0,
      critical: 0,
    },
    criticalDevices: [],
    warningDevices: [],
    anomalyTimeline: [
      {
        id: 1,
        time: "09:20",
        device: "FRZ-02",
        department: "Laboratorio A",
        severity: "ok",
        message: "Temperatura rientrata nel range — controllo completato",
      },
      {
        id: 2,
        time: "08:05",
        device: "CRYO-02",
        department: "Deposito C",
        severity: "ok",
        message: "Ricarica azoto completata con successo",
      },
    ],
  },

  [SCENARIO_IDS.MEDIUM]: {
    clinicStatus: {
      level: "ATTENZIONE",
      label: "Stato Clinica: ATTENZIONE",
      summary: "2 warning attivi. Monitoraggio consigliato, nessun allarme critico al momento.",
      updatedAt: "05/06/2026, 16:42",
    },
    deviceCounts: {
      ok: 17,
      warning: 2,
      critical: 0,
    },
    criticalDevices: [],
    warningDevices: [
      {
        id: "VIB-07",
        priority: "P3",
        problem: "Trend in peggioramento — vibrazione elevata",
        department: "Laboratorio B",
        risk: "Possibile attrito meccanico sul compressore",
        action: "Serve manutenzione — programma controllo entro oggi",
        detectedAt: "05/06/2026, 14:30",
        timeToCritical: "~8 ore",
      },
      {
        id: "TEMP-12",
        priority: "P4",
        problem: "Oscillazione temperatura fuori dal range abituale",
        department: "Laboratorio B",
        risk: "Monitoraggio consigliato",
        action: "Controlla ora le condizioni del locale",
        detectedAt: "05/06/2026, 11:45",
        timeToCritical: null,
      },
    ],
    anomalyTimeline: [
      {
        id: 1,
        time: "14:30",
        device: "VIB-07",
        department: "Laboratorio B",
        severity: "warning",
        message: "Quando il locale si scalda, il macchinario vibra di più",
      },
      {
        id: 2,
        time: "11:45",
        device: "TEMP-12",
        department: "Laboratorio B",
        severity: "warning",
        message: "Oscillazione temperatura — trend da monitorare",
      },
      {
        id: 3,
        time: "09:20",
        device: "FRZ-02",
        department: "Laboratorio A",
        severity: "ok",
        message: "Risolto — temperatura rientrata nel range",
      },
    ],
  },

  [SCENARIO_IDS.HIGH]: {
    clinicStatus: {
      level: "CRITICO",
      label: "Stato Clinica: CRITICO",
      summary: "2 dispositivi richiedono intervento immediato. I campioni in Deposito C sono a rischio.",
      updatedAt: "05/06/2026, 16:42",
    },
    deviceCounts: {
      ok: 14,
      warning: 3,
      critical: 2,
    },
    criticalDevices: [
      {
        id: "CRYO-01",
        priority: "P1",
        problem: "Livello azoto in calo rapido",
        department: "Deposito C",
        risk: "Campioni a rischio irreversibile",
        action: "Ricaricare azoto e verificare perdita",
        detectedAt: "05/06/2026, 16:18",
        timeToCritical: "~45 min",
      },
      {
        id: "FRZ-04",
        priority: "P2",
        problem: "La temperatura è troppo alta per questo dispositivo",
        department: "Laboratorio A",
        risk: "Degradazione campioni biologici",
        action: "Verifica subito il campione e il setpoint",
        detectedAt: "05/06/2026, 15:55",
        timeToCritical: "~2 ore",
      },
    ],
    warningDevices: [
      {
        id: "VIB-07",
        priority: "P3",
        problem: "Trend in peggioramento — vibrazione elevata",
        department: "Laboratorio B",
        risk: "Possibile attrito meccanico sul compressore",
        action: "Serve manutenzione — programma controllo entro oggi",
        detectedAt: "05/06/2026, 14:30",
        timeToCritical: "~8 ore",
      },
      {
        id: "CRYO-03",
        priority: "P3",
        problem: "Livello azoto in avvicinamento alla soglia warning",
        department: "Edificio Principale",
        risk: "Rischio campioni se il calo continua",
        action: "Verifica sensore e pianifica ricarica",
        detectedAt: "05/06/2026, 13:10",
        timeToCritical: "~6 ore",
      },
      {
        id: "TEMP-12",
        priority: "P4",
        problem: "Oscillazione temperatura fuori dal range abituale",
        department: "Laboratorio B",
        risk: "Monitoraggio consigliato",
        action: "Controlla ora le condizioni del locale",
        detectedAt: "05/06/2026, 11:45",
        timeToCritical: null,
      },
    ],
    anomalyTimeline: [
      {
        id: 1,
        time: "16:42",
        device: "CRYO-01",
        department: "Deposito C",
        severity: "critical",
        message: "Livello azoto sotto soglia critica — calo rapido in corso",
      },
      {
        id: 2,
        time: "16:18",
        device: "CRYO-01",
        department: "Deposito C",
        severity: "critical",
        message: "Alert P1 aperto — rischio campioni irreversibile",
      },
      {
        id: 3,
        time: "15:55",
        device: "FRZ-04",
        department: "Laboratorio A",
        severity: "critical",
        message: "Temperatura troppo alta — verifica setpoint",
      },
      {
        id: 4,
        time: "14:30",
        device: "VIB-07",
        department: "Laboratorio B",
        severity: "warning",
        message: "Quando il locale si scalda, il macchinario vibra di più",
      },
    ],
  },
}

export function getDashboardScenario(scenarioId) {
  return dashboardScenarios[scenarioId] ?? dashboardScenarios[SCENARIO_IDS.HIGH]
}
