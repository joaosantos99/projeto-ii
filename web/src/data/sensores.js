// Sensor types accepted by the backend (see server/src/lib/units.js).
export const SENSOR_TYPE_OPTIONS = [
  { value: "temperature", label: "Temperatura", unit: "°C" },
  { value: "humidity", label: "Humidade", unit: "%" },
  { value: "light", label: "Luminosidade", unit: "lux" },
  { value: "sound", label: "Som", unit: "dB" },
]

export const sensorTypeLabels = SENSOR_TYPE_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.label
  return acc
}, {})

export const canonicalUnitByType = SENSOR_TYPE_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.unit
  return acc
}, {})

// The backend tracks sensor health through is_active only; "degradado" has no
// source yet but is kept in the distribution so the chart matches the design.
export const sensorStatusLabels = {
  online: "Online",
  degradado: "Degradado",
  offline: "Offline",
}

export function sensorStatus(sensor) {
  return sensor.isActive ? "online" : "offline"
}

export function statusBadgeVariant(status) {
  if (status === "offline") return "destructive"
  if (status === "degradado") return "warning"
  return "secondary"
}
