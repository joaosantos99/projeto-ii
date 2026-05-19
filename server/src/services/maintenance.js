import MaintenanceTasks from '../database/models/MaintenanceTasks.js';

/**
 * Service for the maintenance task routes.
 */
class MaintenanceService {
  /**
   * Get all maintenance tasks.
   * @returns {Promise<Array<User>>} - The maintenance tasks.
   */
  static async getTasks(spaceId) {
    const tasks = await MaintenanceTasks.findAll({
        where: { green_spaces_id: spaceId }
    });

    if (!tasks.length) {
      const error = new Error('No maintenance tasks found');
      error.statusCode = 404;
      throw error;
    }

    return tasks;
  }

  /**
   * Delete a zone.
   * @returns {Promise<Array<GreenSpaceZones>>} - The tasks.
   */
  static async deleteTask(maintenanceId) {
    const task = await MaintenanceTasks.findByPk(maintenanceId);

    if (!task) {
      const error = new Error('Maintenance task not found');
      error.statusCode = 404;
      throw error;
    }

    await task.destroy();
  }
}

export default MaintenanceService;
