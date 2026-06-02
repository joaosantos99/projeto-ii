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
      if (req.params.spaceId) {
        const alerts = await AlertsService.getAlertsBySpace(req.params.spaceId);
        return res.json(AlertsSerializer.serialize(alerts));
      }

      const severity = req.query.severity;

      if (req.query.onlyCount === 'true') {
        const total = await AlertsService.countAlerts({ severity });
        return res.json({ meta: { total } });
      }

      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, parseInt(req.query.limit) || 20);

      const { alerts, total } = await AlertsService.getAlerts({ page, limit, severity });

      res.json(AlertsSerializer.serializePaginated(alerts, { page, limit, total }));
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
