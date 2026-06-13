import Alerts from '../database/models/Alerts.js';
import GreenSpaceZones from '../database/models/GreenSpaceZones.js';
import GreenSpaces from '../database/models/GreenSpaces.js';

const ALERT_STATUS = {
  ACKNOWLEDGED: 'confirmed',
  CRITICAL: 'critical',
};

const BREACH_SEVERITY = {
  HIGH: 'high',
  CRITICAL: 'critical',
};

/**
 * Classify an out-of-range value against a sensor's [min, max] band. A value
 * beyond a bound by more than 20% of the band width is "critical"; any smaller
 * breach is "high". A value inside the band returns null (no breach).
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {string|null}
 */
function classifyBreach(value, min, max) {
  const margin = Math.max(max - min, 0) * 0.2;
  if (value < min) return value < min - margin ? BREACH_SEVERITY.CRITICAL : BREACH_SEVERITY.HIGH;
  if (value > max) return value > max + margin ? BREACH_SEVERITY.CRITICAL : BREACH_SEVERITY.HIGH;
  return null;
}

/**
 * Build the Sequelize where clause for alert listing/counting.
 * @param {Object} options
 * @param {string} [options.severity] - Filter by severity.
 * @param {boolean} [options.unacknowledgedOnly] - Exclude confirmed alerts.
 * @returns {Object|undefined} The where clause.
 */
function buildAlertsWhere({ severity, unacknowledgedOnly, acknowledgedOnly } = {}) {
  const where = {};

  if (severity) where.severity = severity;

  if (unacknowledgedOnly) where.is_notified = false;
  else if (acknowledgedOnly) where.is_notified = true;

  return Object.keys(where).length ? where : undefined;
}

/**
 * Service for the alerts routes.
 */
class AlertsService {
  /**
   * Get all alerts for a space (unpaginated).
   * @param {string} spaceId - Green space id.
   * @returns {Promise<Array<Alerts>>} - The alerts.
   */
  static async getAlertsBySpace(spaceId) {
    return Alerts.findAll({
      where: { green_space_id: spaceId },
      order: [['created_at', 'DESC']],
    });
  }

  /**
   * Count alerts, optionally filtered by severity.
   * @param {Object} options
   * @param {string} [options.severity] - Filter by severity.
   * @param {boolean} [options.unacknowledgedOnly] - Exclude confirmed alerts.
   * @returns {Promise<number>} The matching alert count.
   */
  static async countAlerts({ severity, unacknowledgedOnly, acknowledgedOnly } = {}) {
    return Alerts.count({
      where: buildAlertsWhere({ severity, unacknowledgedOnly, acknowledgedOnly }),
    });
  }

  /**
   * Get a paginated, optionally severity-filtered list of alerts.
   * @param {Object} options
   * @param {number} options.page
   * @param {number} options.limit
   * @param {string} [options.severity] - Filter by severity.
   * @param {boolean} [options.unacknowledgedOnly] - Exclude confirmed alerts.
   * @returns {Promise<Object>} Alerts array and total count.
   */
  static async getAlerts({
    page = 1,
    limit = 20,
    severity,
    unacknowledgedOnly,
    acknowledgedOnly,
  } = {}) {
    const offset = (page - 1) * limit;

    const { count: total, rows: alerts } = await Alerts.findAndCountAll({
      where: buildAlertsWhere({ severity, unacknowledgedOnly, acknowledgedOnly }),
      include: [{ model: GreenSpaces, as: 'greenSpace', attributes: ['name'] }],
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    return { alerts, total };
  }

  /**
   * Get alert by id.
   * @returns {Promise<Alerts>} - The alert.
   */
  static async getAlertById(incidentId) {
    const alert = await Alerts.findByPk(incidentId);

    if (!alert) {
      const error = new Error('Alert not found');
      error.statusCode = 404;
      throw error;
    }

    return alert;
  }

  /**
   * Get a summary of alerts stats.
   * @returns {Promise<Object>} The alerts summary.
   */
  static async getSummary() {
    const totalAlerts = await Alerts.count();

    const totalCriticalAlerts = await Alerts.count({
      where: { severity: ALERT_STATUS.CRITICAL },
    });

    const totalToRecognize = await Alerts.count({
      where: { is_notified: false },
    });

    return {
      totalActiveRules: 0,
      totalToRecognize,
      totalCriticalAlerts,
      totalAlerts,
    };
  }

  /**
   * Resolve the owning green space id for a sensor. Sensors reference a zone,
   * which in turn references the green space.
   * @param {Object} sensor - A sensor instance (must have green_space_zone_id).
   * @param {string} [greenSpaceId] - Explicit id; resolved from the zone if omitted.
   * @returns {Promise<string>}
   */
  static async #resolveGreenSpaceId(sensor, greenSpaceId) {
    if (greenSpaceId) return greenSpaceId;
    const zone = await GreenSpaceZones.findByPk(sensor.green_space_zone_id);
    if (!zone) {
      const error = new Error('Sensor zone not found');
      error.statusCode = 404;
      throw error;
    }
    return zone.green_spaces_id;
  }

  /**
   * Evaluate a sensor reading against the sensor's configured thresholds and,
   * when the value falls outside [min_value, max_value], persist an alert.
   * This is the alert-generation entry point (RF01.3 / TC002): a value that
   * breaches a limit produces an alert; a value within range produces none.
   * @param {Object} params
   * @param {Object} params.sensor - Sensor instance (id, green_space_zone_id, min_value, max_value, parameter, unit).
   * @param {number} params.value - The reading value, in the sensor's canonical unit.
   * @param {string} [params.greenSpaceId] - Owning space id; resolved from the zone if omitted.
   * @param {string} params.createdBy - User id credited with the alert.
   * @returns {Promise<Alerts|null>} The created alert, or null when in range.
   */
  static async evaluateReading({ sensor, value, greenSpaceId, createdBy }) {
    if (sensor == null) {
      const error = new Error('Sensor is required');
      error.statusCode = 400;
      throw error;
    }

    const num = Number(value);
    if (Number.isNaN(num)) {
      const error = new Error(`Value "${value}" is not a number.`);
      error.statusCode = 400;
      throw error;
    }

    const min = Number(sensor.min_value);
    const max = Number(sensor.max_value);
    const severity = classifyBreach(num, min, max);
    if (!severity) return null;

    const unit = sensor.unit ?? '';
    const bound = num < min ? `mínimo (${min}${unit})` : `máximo (${max}${unit})`;
    const message = `Leitura ${num}${unit} de "${sensor.parameter}" ultrapassa o limite ${bound}.`;

    const resolvedSpaceId = await AlertsService.#resolveGreenSpaceId(sensor, greenSpaceId);

    return Alerts.create({
      sensor_id: sensor.id,
      green_space_id: resolvedSpaceId,
      severity,
      message,
      is_notified: false,
      created_by: createdBy,
    });
  }

  /**
   * Update an alert by ID. Only provided fields change.
   * Pass `acknowledged: true` to acknowledge it (sets status + is_notified).
   * @param {string} alertId - The alert UUID.
   * @param {Object} data - { severity, message, is_notified, acknowledged, updated_by }.
   * @returns {Promise<Alerts>} The updated alert.
   */
  static async updateAlert(alertId, data) {
    const alert = await this.getAlertById(alertId);

    const changes = {
      updated_at: new Date(),
      updated_by: data.updated_by,
    };

    if (data.severity !== undefined) changes.severity = data.severity;
    if (data.message !== undefined) changes.message = data.message;
    if (data.is_notified !== undefined) changes.is_notified = data.is_notified;

    if (data.acknowledged === true) {
      changes.status = ALERT_STATUS.ACKNOWLEDGED;
      changes.is_notified = true;
    }

    await alert.update(changes);

    return alert;
  }
}

export default AlertsService;
