import Alerts from '../database/models/Alerts.js';

/**
 * Service for the alerts routes.
 */
class AlertsService {
  /**
   * Get all spaces.
   * @returns {Promise<Array<User>>} - The spaces.
   */
  static async getAlerts(spaceId) {
    const alerts = await Alerts.findAll({
        where: { green_space_id: spaceId }
    });

    if (!alerts.length) {
      const error = new Error('No alerts found');
      error.statusCode = 404;
      throw error;
    }

    return alerts;
  }

  /**
   * Get alert.
   * @returns {Promise<Array<User>>} - The alert.
   */
  static async getAlertById(incidentId) {
    const alert = await Alerts.findByPk(incidentId)

    if (!alert) {
      const error = new Error('Alert not found');
      error.statusCode = 404;
      throw error;
    }

    return alert;
  }

  /**
   * Update an alert.
   * @returns {Promise<Array<Alerts>>} - The alerts.
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
}

export default AlertsService;
