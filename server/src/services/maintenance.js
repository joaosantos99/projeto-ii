import { Op } from 'sequelize';

import MaintenanceTasks from '../database/models/MaintenanceTasks.js';

const TASK_STATUS = {
  IN_PROGRESS: 'in_progress',
  CRITICAL: 'critical',
};

class MaintenanceService {

  /**
   * Get a summary of maintenance tasks.
   * @returns {Promise<Object>} The maintenance summary.
   */
  static async getSummary() {
    const now = new Date();

    const totalInProgressTasks = await MaintenanceTasks.count({
      where: { status: TASK_STATUS.IN_PROGRESS },
    });

    const totalCriticalTasks = await MaintenanceTasks.count({
      where: { status: TASK_STATUS.CRITICAL },
    });

    const totalLateTasks = await MaintenanceTasks.count({
      where: {
        scheduled_date: { [Op.lt]: now },
        completed_at: null,
      },
    });

    return {
      totalActiveRules: 0,
      totalInProgressTasks,
      totalCriticalTasks,
      totalLateTasks,
    };
  }
}

export default MaintenanceService;