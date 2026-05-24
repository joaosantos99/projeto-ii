import { Op } from 'sequelize';

import Alerts from '../database/models/Alerts.js';
import MaintenanceTasks from '../database/models/MaintenanceTasks.js';
import Reports from '../database/models/Reports.js';
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

  /**
   * Get paginated citizen-reported incidents (type = 'incident').
   * @param {Object} options
   * @param {number} options.page
   * @param {number} options.limit
   * @param {string} [options.sort]
   * @returns {Promise<Object>} Incidents array and total count.
   */
  static async getCitizenIncidents({ page = 1, limit = 20, sort } = {}) {
    const offset = (page - 1) * limit;

    let order = [['created_at', 'DESC']];
    if (sort) {
      const [field, direction] = sort.split(':');
      const allowedFields = ['created_at'];
      const allowedDirections = ['asc', 'desc'];
      if (allowedFields.includes(field) && allowedDirections.includes(direction?.toLowerCase())) {
        order = [[field, direction.toUpperCase()]];
      }
    }

    const { count: total, rows: incidents } = await Reports.findAndCountAll({
      where: { type: 'incident' },
      order,
      limit,
      offset,
    });

    return { incidents, total };
  }
}

export default DashboardService;