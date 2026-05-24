import Alerts from '../database/models/Alerts.js';

const ALERT_STATUS = {
  ACKNOWLEDGED: 'confirmed',
  CRITICAL: 'critical',
};

/**
 * Service for the alerts routes.
 */
class AlertsService {
  /**
   * Get all alerts for a space.
   * @returns {Promise<Array<Alerts>>} - The alerts.
   */
  static async getAlerts(spaceId) {
    return Alerts.findAll({
      where: { green_space_id: spaceId },
      order: [['created_at', 'DESC']],
    });
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
}

export default AlertsService;
