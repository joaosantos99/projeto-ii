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
      const unacknowledgedOnly = req.query.unacknowledgedOnly === 'true';
      const acknowledgedOnly = req.query.acknowledgedOnly === 'true';

      if (req.query.onlyCount === 'true') {
        const total = await AlertsService.countAlerts({
          severity,
          unacknowledgedOnly,
          acknowledgedOnly,
        });
        return res.json({ meta: { total } });
      }

      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, parseInt(req.query.limit) || 20);

      const { alerts, total } = await AlertsService.getAlerts({
        page,
        limit,
        severity,
        unacknowledgedOnly,
        acknowledgedOnly,
      });

      const payload = AlertsSerializer.serializePaginated(alerts, { page, limit, total });

      if (req.query.summary === 'true') {
        payload.summary = AlertsSerializer.serializeSummary(await AlertsService.getSummary());
      }

      res.json(payload);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Update an alert. Pass `acknowledged: true` to acknowledge it.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async updateAlert(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'No fields provided for update' });
      }

      const { severity, message, is_notified, acknowledged } = req.body;
      const updatedAlert = await AlertsService.updateAlert(req.params.alertId, {
        severity,
        message,
        is_notified,
        acknowledged,
        updated_by: req.user?.id,
      });

      res.json(AlertsSerializer.serialize(updatedAlert));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

export default AlertsController;
