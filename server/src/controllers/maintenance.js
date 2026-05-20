import MaintenanceSerializer from '../serializers/MaintenanceSerializer.js';
import MaintenanceService from '../services/maintenance.js';

/**
 * Controller for the maintenance tasks routes.
 */
class MaintenanceController {
  /**
   * Get all maintenance tasks.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getTasks(req, res) {
    try {
      const tasks = await MaintenanceService.getTasks(req.params.spaceId);

      res.json(MaintenanceSerializer.serialize(tasks));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
  * Delete a task.
  * @param {Object} req - The request object.
  * @param {Object} res - The response object.
  */
  static async deleteTask(req, res) {
    try {
      await MaintenanceService.deleteTask(req.params.maintenanceId);
      res.status(204).send();
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

export default MaintenanceController;
