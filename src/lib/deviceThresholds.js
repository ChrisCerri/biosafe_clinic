export const DEVICE_TYPES = {
  INC: "INC",
  CELL: "CELL",
  CRYO: "CRYO",
  HVAC: "HVAC",
}

export const DEVICE_TYPE_LABELS = {
  [DEVICE_TYPES.INC]: "Incubatore biologico",
  [DEVICE_TYPES.CELL]: "Cella di coltura",
  [DEVICE_TYPES.CRYO]: "Banca criogenica",
  [DEVICE_TYPES.HVAC]: "HVAC",
}

export const PARAMETER_LABELS = {
  temperature: "Temperatura",
  vibration: "Vibrazione",
  nitrogen: "Livello azoto",
}

export const thresholdReference = [
  {
    type: DEVICE_TYPES.INC,
    label: "Incubatori biologici (INC)",
    parameters: {
      temperature: [
        { status: "ok", label: "Normale", value: "36.0°C - 38.0°C" },
        { status: "warning", label: "Warning", value: "< 36.0°C oppure > 38.0°C" },
        { status: "critical", label: "Critical", value: "< 35.0°C oppure > 39.0°C" },
      ],
      vibration: [
        { status: "ok", label: "Normale", value: "< 0.6 mm/s" },
        { status: "warning", label: "Warning", value: "0.6 - 1.0 mm/s" },
        { status: "critical", label: "Critical", value: "> 1.0 mm/s" },
      ],
    },
  },
  {
    type: DEVICE_TYPES.CELL,
    label: "Celle di coltura (CELL)",
    parameters: {
      temperature: [
        { status: "ok", label: "Normale", value: "36.0°C - 38.0°C" },
        { status: "warning", label: "Warning", value: "< 36.0°C oppure > 38.0°C" },
        { status: "critical", label: "Critical", value: "< 35.0°C oppure > 39.0°C" },
      ],
      vibration: [
        { status: "ok", label: "Normale", value: "< 0.4 mm/s" },
        { status: "warning", label: "Warning", value: "0.4 - 0.8 mm/s" },
        { status: "critical", label: "Critical", value: "> 0.8 mm/s" },
      ],
    },
  },
  {
    type: DEVICE_TYPES.CRYO,
    label: "Banche criogeniche (CRYO)",
    note: "Temperature meno negative sono più pericolose (-196°C OK, -193°C Warning, -189°C Critical).",
    parameters: {
      temperature: [
        { status: "ok", label: "Normale", value: "< -194°C" },
        { status: "warning", label: "Warning", value: "> -192°C" },
        { status: "critical", label: "Critical", value: "> -190°C" },
      ],
      vibration: [
        { status: "ok", label: "Normale", value: "< 0.5 mm/s" },
        { status: "warning", label: "Warning", value: "0.5 - 1.0 mm/s" },
        { status: "critical", label: "Critical", value: "> 1.0 mm/s" },
      ],
      nitrogen: [
        { status: "ok", label: "Normale", value: "> 40%" },
        { status: "warning", label: "Warning", value: "35% - 40%" },
        { status: "critical", label: "Critical", value: "< 25%" },
      ],
    },
  },
  {
    type: DEVICE_TYPES.HVAC,
    label: "HVAC",
    parameters: {
      temperature: [
        { status: "ok", label: "Normale", value: "19°C - 23°C" },
        { status: "warning", label: "Warning", value: "< 19°C oppure > 23°C" },
        { status: "critical", label: "Critical", value: "< 18°C oppure > 25°C" },
      ],
      vibration: [
        { status: "ok", label: "Normale", value: "< 1.2 mm/s" },
        { status: "warning", label: "Warning", value: "1.2 - 2.0 mm/s" },
        { status: "critical", label: "Critical", value: "> 2.0 mm/s" },
      ],
    },
  },
]
