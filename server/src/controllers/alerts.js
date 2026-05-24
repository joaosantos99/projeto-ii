import AlertsSerializer from '../serializers/AlertsSerializer.js';
import AlertsService from '../services/alerts.js';

/**
 * Controller for the alerts routes.
 */
class AlertsController {
  /**
   * Get all alerts.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getAlerts(req, res) {
    try {
      const alerts = await AlertsService.getAlerts(req.params.spaceId);

      res.json(AlertsSerializer.serialize(alerts));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Update an alert.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async updateAlert(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'No fields provided for update' });
      }

      const alert = await AlertsService.getAlertById(req.params.incidentId);
      const { severity, message, is_notified } = req.body;
      const updatedAlert = await alert.update({ severity, message, is_notified });

      res.json(AlertsSerializer.serialize(updatedAlert));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Get a summary of alerts stats.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getSummary(req, res) {
    try {
      const summary = await AlertsService.getSummary();

      res.json(AlertsSerializer.serializeSummary(summary));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Acknowledge an alert.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async acknowledgeAlert(req, res) {
    try {
      const alert = await AlertsService.acknowledgeAlert(
        req.params.alertId,
        req.user?.id,
      );

      res.json(AlertsSerializer.serializeAcknowledge(alert));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

export default AlertsController;
