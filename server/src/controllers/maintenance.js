import MaintenanceSerializer from '../serializers/MaintenanceSerializer.js';
import MaintenanceService from '../services/maintenance.js';

/**
 * Controller for the maintenance tasks routes.
 */
class MaintenanceController {
  /**
   * Get maintenance tasks. Filtered by space when nested, paginated globally otherwise.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getTasks(req, res) {
    try {
      if (req.params.spaceId) {
        const tasks = await MaintenanceService.getTasksBySpace(req.params.spaceId);
        return res.json(MaintenanceSerializer.serialize(tasks));
      }

      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, parseInt(req.query.limit) || 20);
      const status = req.query.status;

      const { tasks, total } = await MaintenanceService.getTasks({ page, limit, status });

      const payload = MaintenanceSerializer.serializePaginated(tasks, { page, limit, total });

      if (req.query.summary === 'true') {
        const summary = await MaintenanceService.getSummary();
        payload.summary = MaintenanceSerializer.serializeSummary(summary);
      }

      if (req.query.includeAverageResponseTime === 'true') {
        payload.meta.averageResponseTime = await MaintenanceService.getAverageResponseTime();
      }

      res.json(payload);
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }

  /**
   * Get a single maintenance task by id.
   * GET /api/maintenance/:maintenanceId
   */
  static async getTaskById(req, res) {
    try {
      const task = await MaintenanceService.getTaskById(req.params.maintenanceId);
      res.json(MaintenanceSerializer.serializeWithLinks(task));
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
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
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }

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
   * Full replacement of a maintenance task.
   * PUT /api/maintenance/:maintenanceId
   */
  static async updateTask(req, res) {
    try {
      const task = await MaintenanceService.updateTask(req.params.maintenanceId, {
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
   * Partial update of a maintenance task (any subset of fields, incl. status).
   * Setting status to 'completed' stamps completed_at automatically.
   * PATCH /api/maintenance/:maintenanceId
   */
  static async patchTask(req, res) {
    try {
      const task = await MaintenanceService.patchTask(req.params.maintenanceId, {
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

}

export default MaintenanceController;
