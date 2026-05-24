import { Op } from 'sequelize';

import Alerts from '../database/models/Alerts.js';
import MaintenanceTasks from '../database/models/MaintenanceTasks.js';
import Sensors from '../database/models/Sensors.js';

class DashboardService {

  /**
   * Get the dashboard summary.
   * Aggregates data across Alerts, MaintenanceTasks and Sensors.
   * @returns {Promise<Object>} The dashboard summary.
   */
  static async getSummary() {
    const now = new Date();

    const totalAlerts = await Alerts.count();

    const totalLateMaintenance = await MaintenanceTasks.count({
      where: {
        scheduled_date: { [Op.lt]: now },
        completed_at: null,
      },
    });

    const totalOfflineSensors = await Sensors.count({
      where: { is_active: false },
    });

    const averageResponseTime = 0;

    return {
      totalAlerts,
      totalLateMaintenance,
      totalOfflineSensors,
      averageResponseTime,
    };
  }
}

export default DashboardService;