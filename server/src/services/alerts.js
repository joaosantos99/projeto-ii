import Alerts from '../database/models/Alerts.js';
import GreenSpaces from '../database/models/GreenSpaces.js';

const ALERT_STATUS = {
  ACKNOWLEDGED: 'confirmed',
  CRITICAL: 'critical',
};

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
   * Update an alert.
   * @returns {Promise<Alerts>} - The alert.
   */
  static async updateAlert(incidentId, data) {
    const alert = await Alerts.findByPk(incidentId);

    if (!alert) {
      const error = new Error('Alert not found');
      error.statusCode = 404;
      throw error;
    }

    const updatedAlert = await alert.update(data);
    return updatedAlert;
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
