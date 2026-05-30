export const SENSOR_UNITS = {
  temperature: { unit: '°C',   label: 'Temperatura' },
  humidity:    { unit: '%',    label: 'Humidade'    },
  light:       { unit: 'lux',  label: 'Luminosidade' },
  sound:       { unit: 'dB',   label: 'Som'         },
};

export const getUnit  = (type) => SENSOR_UNITS[type]?.unit  ?? '';
export const getLabel = (type) => SENSOR_UNITS[type]?.label ?? type;

/**
 * Formats a sensor value with its unit for display.
 * Prefers the `unit` field already in the sensor object (from the API).
 */
export function formatValue(value, sensorOrType) {
  if (value === null || value === undefined) return 'N/D';
  const unit = typeof sensorOrType === 'string'
    ? getUnit(sensorOrType)
    : (sensorOrType?.unit ?? getUnit(sensorOrType?.type));
  return unit ? `${value} ${unit}` : String(value);
}