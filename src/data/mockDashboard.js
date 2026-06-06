export const DEPARTMENTS = [
  "Laboratorio A",
  "Laboratorio B",
  "Deposito C",
  "Edificio Principale",
]

export const clinicStatus = {
  level: "CRITICO",
  label: "Stato Clinica: CRITICO",
  summary: "2 dispositivi richiedono intervento immediato. I campioni in Deposito C sono a rischio.",
  updatedAt: "05/06/2026, 16:42",
}

export const deviceCounts = {
  ok: 14,
  warning: 3,
  critical: 2,
}

export const criticalDevices = [
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
]

export const warningDevices = [
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
]

export const okDevices = [
  { id: "CRYO-02", department: "Deposito C" },
  { id: "FRZ-01", department: "Laboratorio A" },
  { id: "FRZ-02", department: "Laboratorio A" },
  { id: "FRZ-03", department: "Laboratorio A" },
  { id: "FRZ-05", department: "Laboratorio B" },
  { id: "FRZ-06", department: "Laboratorio B" },
  { id: "TEMP-01", department: "Laboratorio A" },
  { id: "TEMP-02", department: "Laboratorio B" },
  { id: "TEMP-03", department: "Deposito C" },
  { id: "TEMP-04", department: "Edificio Principale" },
  { id: "VIB-01", department: "Laboratorio A" },
  { id: "VIB-02", department: "Deposito C" },
  { id: "CRYO-04", department: "Edificio Principale" },
  { id: "FRZ-07", department: "Edificio Principale" },
]

export const mostAtRiskDepartment = {
  name: "Deposito C",
  status: "CRITICO",
  criticalCount: 1,
  warningCount: 0,
  okCount: 2,
  lastAnomaly: "CRYO-01 — livello azoto in calo rapido (16:18)",
  responsible: "Marco Bianchi — Turno serale",
}

export const lastCriticalAlert = {
  device: "CRYO-01",
  priority: "P1",
  message: "Livello azoto in calo rapido — campioni a rischio irreversibile",
  department: "Deposito C",
  detectedAt: "05/06/2026, 16:18",
  timeToCritical: "~45 min",
  action: "Ricaricare azoto e verificare perdita",
  acknowledged: false,
}

export const anomalyTimeline = [
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
  {
    id: 5,
    time: "13:10",
    device: "CRYO-03",
    department: "Edificio Principale",
    severity: "warning",
    message: "Livello azoto in avvicinamento alla soglia warning",
  },
  {
    id: 6,
    time: "11:45",
    device: "TEMP-12",
    department: "Laboratorio B",
    severity: "warning",
    message: "Oscillazione temperatura — trend da monitorare",
  },
  {
    id: 7,
    time: "09:20",
    device: "FRZ-02",
    department: "Laboratorio A",
    severity: "ok",
    message: "Risolto — temperatura rientrata nel range",
  },
]

export const departmentOverview = [
  {
    name: "Deposito C",
    status: "critical",
    critical: 1,
    warning: 0,
    ok: 2,
  },
  {
    name: "Laboratorio A",
    status: "critical",
    critical: 1,
    warning: 0,
    ok: 5,
  },
  {
    name: "Laboratorio B",
    status: "warning",
    critical: 0,
    warning: 2,
    ok: 3,
  },
  {
    name: "Edificio Principale",
    status: "warning",
    critical: 0,
    warning: 1,
    ok: 4,
  },
]
