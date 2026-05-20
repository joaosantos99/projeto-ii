import MaintenanceSerializer from '../serializers/MaintenanceSerializer.js';
import MaintenanceService from '../services/maintenance.js';

class MaintenanceController {

  static async getSummary(req, res) {
    try {
      const summary = await MaintenanceService.getSummary();

      res.json(MaintenanceSerializer.serializeSummary(summary));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

export default MaintenanceController;