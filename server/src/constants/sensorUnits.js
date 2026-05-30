export const SENSOR_UNITS = {
  temperature: {
    unit: '°C',
    label: 'Temperatura',
    description: 'Temperatura ambiente em graus Celsius',
  },
  humidity: {
    unit: '%',
    label: 'Humidade',
    description: 'Humidade relativa do ar em percentagem',
  },
  light: {
    unit: 'lux',
    label: 'Luminosidade',
    description: 'Intensidade luminosa em lux',
  },
  sound: {
    unit: 'dB',
    label: 'Som',
    description: 'Nível de pressão sonora em decibéis',
  },
};

/**
 * Returns the unit string for a given sensor type.
 * Falls back to an empty string if the type is unknown.
 * @param {string} type
 * @returns {string}
 */
export function getUnit(type) {
  return SENSOR_UNITS[type]?.unit ?? '';
}

/**
 * Normalizes a raw sensor value to a display string with its unit.
 * @param {number|null} value
 * @param {string} type
 * @returns {string}
 */
export function formatSensorValue(value, type) {
  if (value === null || value === undefined) return 'N/D';
  const unit = getUnit(type);
  return unit ? `${value} ${unit}` : String(value);
}