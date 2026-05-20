import AlertSerializer from '../serializers/AlertSerializer.js';
import AlertsService from '../services/alerts.js';


class AlertsController {

  static async getSummary(req, res) {
    try {
      const summary = await AlertsService.getSummary();

      res.json(AlertSerializer.serializeSummary(summary));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  static async acknowledgeAlert(req, res) {
    try {
      const alert = await AlertsService.acknowledgeAlert(
        req.params.alertId,
        req.user?.id,
      );

      res.json(AlertSerializer.serializeAcknowledge(alert));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

export default AlertsController;