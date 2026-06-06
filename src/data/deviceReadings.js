export const DEPARTMENTS = [
  "Laboratorio A",
  "Laboratorio B",
  "Deposito C",
  "Edificio Principale",
]

const baseDevices = [
  // Laboratorio A — 8 dispositivi
  {
    id: "INC-01",
    type: "INC",
    department: "Laboratorio A",
    readings: { temperature: 37.2, vibration: 0.3 },
    updatedAt: "05/06/2026, 16:42",
  },
  {
    id: "INC-03",
    type: "INC",
    department: "Laboratorio A",
    readings: { temperature: 37.0, vibration: 0.35 },
    updatedAt: "05/06/2026, 16:41",
  },
  {
    id: "INC-04",
    type: "INC",
    department: "Laboratorio A",
    readings: { temperature: 36.8, vibration: 0.28 },
    updatedAt: "05/06/2026, 16:39",
  },
  {
    id: "CELL-01",
    type: "CELL",
    department: "Laboratorio A",
    readings: { temperature: 37.5, vibration: 0.2 },
    updatedAt: "05/06/2026, 16:38",
  },
  {
    id: "CELL-03",
    type: "CELL",
    department: "Laboratorio A",
    readings: { temperature: 37.1, vibration: 0.22 },
    updatedAt: "05/06/2026, 16:37",
  },
  {
    id: "CELL-04",
    type: "CELL",
    department: "Laboratorio A",
    readings: { temperature: 36.9, vibration: 0.18 },
    updatedAt: "05/06/2026, 16:36",
  },
  {
    id: "HVAC-02",
    type: "HVAC",
    department: "Laboratorio A",
    readings: { temperature: 20.5, vibration: 0.7 },
    updatedAt: "05/06/2026, 16:20",
  },
  {
    id: "HVAC-04",
    type: "HVAC",
    department: "Laboratorio A",
    readings: { temperature: 21.0, vibration: 0.75 },
    updatedAt: "05/06/2026, 16:19",
  },

  // Laboratorio B — 7 dispositivi
  {
    id: "INC-02",
    type: "INC",
    department: "Laboratorio B",
    readings: { temperature: 37.0, vibration: 0.4 },
    updatedAt: "05/06/2026, 16:40",
  },
  {
    id: "INC-05",
    type: "INC",
    department: "Laboratorio B",
    readings: { temperature: 36.7, vibration: 0.32 },
    updatedAt: "05/06/2026, 16:34",
  },
  {
    id: "INC-06",
    type: "INC",
    department: "Laboratorio B",
    readings: { temperature: 37.3, vibration: 0.38 },
    updatedAt: "05/06/2026, 16:33",
  },
  {
    id: "CELL-02",
    type: "CELL",
    department: "Laboratorio B",
    readings: { temperature: 36.8, vibration: 0.25 },
    updatedAt: "05/06/2026, 16:35",
  },
  {
    id: "CELL-05",
    type: "CELL",
    department: "Laboratorio B",
    readings: { temperature: 37.2, vibration: 0.21 },
    updatedAt: "05/06/2026, 16:32",
  },
  {
    id: "HVAC-03",
    type: "HVAC",
    department: "Laboratorio B",
    readings: { temperature: 22.0, vibration: 0.9 },
    updatedAt: "05/06/2026, 16:18",
  },
  {
    id: "HVAC-05",
    type: "HVAC",
    department: "Laboratorio B",
    readings: { temperature: 21.5, vibration: 0.85 },
    updatedAt: "05/06/2026, 16:17",
  },

  // Deposito C — 7 dispositivi
  {
    id: "CRYO-01",
    type: "CRYO",
    department: "Deposito C",
    readings: { temperature: -196, vibration: 0.3, nitrogen: 45 },
    updatedAt: "05/06/2026, 16:42",
  },
  {
    id: "CRYO-02",
    type: "CRYO",
    department: "Deposito C",
    readings: { temperature: -195, vibration: 0.35, nitrogen: 42 },
    updatedAt: "05/06/2026, 16:30",
  },
  {
    id: "CRYO-04",
    type: "CRYO",
    department: "Deposito C",
    readings: { temperature: -196, vibration: 0.28, nitrogen: 44 },
    updatedAt: "05/06/2026, 16:29",
  },
  {
    id: "CRYO-05",
    type: "CRYO",
    department: "Deposito C",
    readings: { temperature: -195, vibration: 0.32, nitrogen: 41 },
    updatedAt: "05/06/2026, 16:28",
  },
  {
    id: "INC-07",
    type: "INC",
    department: "Deposito C",
    readings: { temperature: 37.1, vibration: 0.29 },
    updatedAt: "05/06/2026, 16:27",
  },
  {
    id: "CELL-06",
    type: "CELL",
    department: "Deposito C",
    readings: { temperature: 36.6, vibration: 0.19 },
    updatedAt: "05/06/2026, 16:26",
  },
  {
    id: "HVAC-06",
    type: "HVAC",
    department: "Deposito C",
    readings: { temperature: 20.8, vibration: 0.65 },
    updatedAt: "05/06/2026, 16:25",
  },

  // Edificio Principale — 7 dispositivi
  {
    id: "CRYO-03",
    type: "CRYO",
    department: "Edificio Principale",
    readings: { temperature: -195, vibration: 0.28, nitrogen: 43 },
    updatedAt: "05/06/2026, 16:28",
  },
  {
    id: "CRYO-06",
    type: "CRYO",
    department: "Edificio Principale",
    readings: { temperature: -196, vibration: 0.26, nitrogen: 46 },
    updatedAt: "05/06/2026, 16:24",
  },
  {
    id: "CRYO-07",
    type: "CRYO",
    department: "Edificio Principale",
    readings: { temperature: -195, vibration: 0.31, nitrogen: 42 },
    updatedAt: "05/06/2026, 16:23",
  },
  {
    id: "HVAC-01",
    type: "HVAC",
    department: "Edificio Principale",
    readings: { temperature: 21, vibration: 0.8 },
    updatedAt: "05/06/2026, 16:25",
  },
  {
    id: "HVAC-07",
    type: "HVAC",
    department: "Edificio Principale",
    readings: { temperature: 21.2, vibration: 0.72 },
    updatedAt: "05/06/2026, 16:22",
  },
  {
    id: "INC-08",
    type: "INC",
    department: "Edificio Principale",
    readings: { temperature: 37.4, vibration: 0.33 },
    updatedAt: "05/06/2026, 16:21",
  },
  {
    id: "CELL-07",
    type: "CELL",
    department: "Edificio Principale",
    readings: { temperature: 36.5, vibration: 0.17 },
    updatedAt: "05/06/2026, 16:20",
  },
]

function withReadings(overrides) {
  return baseDevices.map((device) => ({
    ...device,
    readings: { ...device.readings, ...(overrides[device.id] ?? {}) },
  }))
}

export const scenarioDevices = {
  none: baseDevices,

  medium: withReadings({
    "INC-02": { temperature: 38.5, vibration: 0.7 },
    "INC-05": { temperature: 38.2, vibration: 0.65 },
    "CELL-02": { temperature: 36.2, vibration: 0.55 },
    "CELL-05": { temperature: 35.8, vibration: 0.5 },
    "CRYO-03": { temperature: -193, vibration: 0.45, nitrogen: 38 },
    "CRYO-05": { temperature: -193, vibration: 0.42, nitrogen: 37 },
    "HVAC-03": { temperature: 23.5, vibration: 1.5 },
    "HVAC-07": { temperature: 23.8, vibration: 1.4 },
  }),

  high: withReadings({
    "CRYO-01": { temperature: -189, vibration: 0.55, nitrogen: 22 },
    "INC-01": { temperature: 39.5, vibration: 1.2 },
    "INC-02": { temperature: 38.5, vibration: 0.65 },
    "CRYO-03": { temperature: -193, vibration: 0.45, nitrogen: 38 },
  }),
}

export function getScenarioDevices(scenarioId) {
  return scenarioDevices[scenarioId] ?? scenarioDevices.high
}

export const TOTAL_DEVICES = baseDevices.length
