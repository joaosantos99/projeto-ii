import DashboardSerializer from '../serializers/DashboardSerializer.js';
import DashboardService from '../services/dashboard.js';

class DashboardController {

  static async getSummary(req, res) {
    try {
      const summary = await DashboardService.getSummary();

      res.json(DashboardSerializer.serializeSummary(summary));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

export default DashboardController;