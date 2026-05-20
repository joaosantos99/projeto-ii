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
    return MaintenanceTasks.findAll({
      where: { green_spaces_id: spaceId },
      order: [['scheduled_date', 'DESC']],
    });
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
