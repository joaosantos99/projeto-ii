import Reports from '../database/models/Reports.js';

class DashboardService {

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