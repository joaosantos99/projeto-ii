/**
 * Unit normalization for sensors.
 *
 * Each sensor type has a single canonical unit. Readings may arrive in any
 * compatible unit (with common aliases / casing); they are converted to the
 * canonical unit before being persisted, so stored values are always
 * comparable within a type.
 */

/** Canonical (stored) unit for each sensor type. */
export const CANONICAL_UNITS = {
  temperature: '°C',
  humidity: '%',
  light: 'lux',
  sound: 'dB',
};

/**
 * Per-type unit table. Keys are normalized aliases (lowercase, trimmed) and
 * `to` converts a value expressed in that unit into the type's canonical unit.
 */
const UNIT_DEFINITIONS = {
  temperature: {
    canonical: '°C',
    units: {
      '°c': { to: (v) => v },
      c: { to: (v) => v },
      celsius: { to: (v) => v },
      '°f': { to: (v) => ((v - 32) * 5) / 9 },
      f: { to: (v) => ((v - 32) * 5) / 9 },
      fahrenheit: { to: (v) => ((v - 32) * 5) / 9 },
      k: { to: (v) => v - 273.15 },
      kelvin: { to: (v) => v - 273.15 },
    },
  },
  humidity: {
    canonical: '%',
    units: {
      '%': { to: (v) => v },
      percent: { to: (v) => v },
      pct: { to: (v) => v },
    },
  },
  light: {
    canonical: 'lux',
    units: {
      lux: { to: (v) => v },
      lx: { to: (v) => v },
      fc: { to: (v) => v * 10.76391 },
      footcandle: { to: (v) => v * 10.76391 },
      'foot-candle': { to: (v) => v * 10.76391 },
    },
  },
  sound: {
    canonical: 'dB',
    units: {
      db: { to: (v) => v },
      dba: { to: (v) => v },
      decibel: { to: (v) => v },
      decibels: { to: (v) => v },
    },
  },
};

/** Sensor types that support unit normalization. */
export const SENSOR_TYPES = Object.keys(UNIT_DEFINITIONS);

function unitError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function round(value) {
  // Trim floating-point noise from conversions while keeping useful precision.
  return Math.round(value * 1e4) / 1e4;
}

/**
 * @param {string} type - The sensor type.
 * @returns {string} The canonical unit for the type.
 * @throws {Error} 400 if the type is unknown.
 */
export function canonicalUnitFor(type) {
  const def = UNIT_DEFINITIONS[type];
  if (!def) throw unitError(`Unknown sensor type: "${type}".`);
  return def.canonical;
}

function lookupUnit(type, unit) {
  const def = UNIT_DEFINITIONS[type];
  if (!def) throw unitError(`Unknown sensor type: "${type}".`);
  const key = String(unit).trim().toLowerCase();
  const found = def.units[key];
  if (!found) {
    const allowed = Object.keys(def.units).join(', ');
    throw unitError(`Unit "${unit}" is not valid for sensor type "${type}". Allowed: ${allowed}.`);
  }
  return found;
}

/**
 * Convert a value expressed in `fromUnit` into the type's canonical unit.
 * @param {string} type - The sensor type.
 * @param {number} value - The value to convert.
 * @param {string} fromUnit - The source unit (alias-aware, case-insensitive).
 * @returns {number} The value in the canonical unit.
 * @throws {Error} 400 if the unit/type is invalid or the value is not numeric.
 */
export function convertValue(type, value, fromUnit) {
  if (value === null || value === undefined) return value;
  const num = Number(value);
  if (Number.isNaN(num)) throw unitError(`Value "${value}" is not a number.`);
  return round(lookupUnit(type, fromUnit).to(num));
}

/**
 * Resolve a (possibly aliased) unit to the canonical unit for its type.
 * @param {string} type - The sensor type.
 * @param {string} unit - The unit to normalize.
 * @returns {string} The canonical unit.
 * @throws {Error} 400 if the unit/type is invalid.
 */
export function normalizeUnit(type, unit) {
  lookupUnit(type, unit);
  return canonicalUnitFor(type);
}

/**
 * Normalize a sensor's unit and threshold values to the canonical unit for its
 * type. When no unit is supplied, the values are assumed to already be in the
 * canonical unit.
 * @param {{type: string, unit?: string, min_value?: number, max_value?: number}} sensor
 * @returns {{unit: string, min_value: number, max_value: number}}
 * @throws {Error} 400 if the type or unit is invalid.
 */
export function normalizeSensorUnits({ type, unit, min_value, max_value }) {
  const canonical = canonicalUnitFor(type);
  const sourceUnit = unit ?? canonical;

  return {
    unit: canonical,
    min_value: min_value == null ? min_value : convertValue(type, min_value, sourceUnit),
    max_value: max_value == null ? max_value : convertValue(type, max_value, sourceUnit),
  };
}
