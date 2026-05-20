import MaintenanceSerializer from '../serializers/MaintenanceSerializer.js';
import MaintenanceService from '../services/maintenance.js';

class MaintenanceController {

  /**
   * Create a new maintenance task.
   * POST /api/maintenance/tasks
   */
  static async createTask(req, res) {
    try {
      const task = await MaintenanceService.createTask({
        ...req.body,
        created_by: req.user?.id,
      });

      res.status(201).json(MaintenanceSerializer.serializeWithLinks(task));
    } catch (error) {
      res.status(error.statusCode || 500).json({
        description: error.message,
        ...(error.errors && { errors: error.errors }),
      });
    }
  }

  /**
   * Get all maintenance tasks (paginated).
   * GET /api/maintenance/tasks
   */
  static async getTasks(req, res) {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, parseInt(req.query.limit) || 20);

      const { tasks, total } = await MaintenanceService.getTasks({ page, limit });

      res.json(MaintenanceSerializer.serializePaginated(tasks, { page, limit, total }));
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }

  /**
   * Update the status of a maintenance task.
   * PATCH /api/maintenance/tasks/:taskId/status
   */
  static async updateTaskStatus(req, res) {
    try {
      const task = await MaintenanceService.updateTaskStatus(
        req.params.taskId,
        req.body.status,
        req.user?.id,
      );

      res.json(MaintenanceSerializer.serializeStatusUpdate(task));
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }

  /**
   * Full update of a maintenance task.
   * PUT /api/maintenance/tasks/:taskId
   */
  static async updateTask(req, res) {
    try {
      const task = await MaintenanceService.updateTask(req.params.taskId, {
        ...req.body,
        updated_by: req.user?.id,
      });

      res.json(MaintenanceSerializer.serializeWithLinks(task));
    } catch (error) {
      res.status(error.statusCode || 500).json({
        description: error.message,
        ...(error.errors && { errors: error.errors }),
      });
    }
  }

  /**
   * Get maintenance summary.
   * GET /api/maintenance/summary
   */
  static async getSummary(req, res) {
    try {
      const summary = await MaintenanceService.getSummary();

      res.json(MaintenanceSerializer.serializeSummary(summary));
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }
}

export default MaintenanceController;