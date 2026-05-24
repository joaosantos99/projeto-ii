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

  static async getCitizenIncidents(req, res) {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, parseInt(req.query.limit) || 20);
      const sort = req.query.sort;

      const { incidents, total } = await DashboardService.getCitizenIncidents({ page, limit, sort });

      res.json(DashboardSerializer.serializeCitizenIncidents(incidents, { page, limit, total }));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

export default DashboardController;