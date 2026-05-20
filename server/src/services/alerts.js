import { Op } from 'sequelize';

import Alerts from '../database/models/Alerts.js';

const ALERT_STATUS = {
  ACKNOWLEDGED: 'confirmed',
  CRITICAL: 'critical',
};

class AlertsService {

  /**
   * Get a summary of alerts stats.
   * @returns {Promise<Object>} The alerts summary.
   */
  static async getSummary() {
    const totalAlerts = await Alerts.count();

    const totalCriticalAlerts = await Alerts.count({
      where: { severity: ALERT_STATUS.CRITICAL },
    });

    // Alerts not yet notified/acknowledged
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
   * Acknowledge an alert by ID.
   * @param {string} alertId - The alert UUID.
   * @param {string} userId - The user performing the action.
   * @returns {Promise<Alerts>} The updated alert.
   */
  static async acknowledgeAlert(alertId, userId) {
    const alert = await Alerts.findByPk(alertId);

    if (!alert) {
      const error = new Error('Alert not found!');
      error.statusCode = 404;
      throw error;
    }

    await alert.update({
      status: ALERT_STATUS.ACKNOWLEDGED,
      is_notified: true,
      updated_at: new Date(),
      updated_by: userId,
    });

    return alert;
  }
}

export default AlertsService;