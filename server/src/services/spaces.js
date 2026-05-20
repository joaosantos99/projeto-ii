import { Op, fn, col, literal } from 'sequelize';

import GreenSpaces from '../database/models/GreenSpaces.js';
import GreenSpaceZones from '../database/models/GreenSpaceZones.js';
import Sensors from '../database/models/Sensors.js';
import Alerts from '../database/models/Alerts.js';

/**
 * Service for the spaces routes.
 */
class SpacesService {
  /**
   * Get paginated and filtered spaces.
   * @param {Object} options
   * @param {number} options.page
   * @param {number} options.perPage
   * @param {string} [options.query]
   * @param {string} [options.city]
   * @returns {Promise<{spaces: Array<Object>, total: number}>}
   */
  static async getSpaces({ page = 1, perPage = 10, query, city } = {}) {
    const where = {};

    if (query) {
      const q = `%${query.toLowerCase()}%`;
      where[Op.or] = [
        literal(`LOWER(name) LIKE ${GreenSpaces.sequelize.escape(q)}`),
        literal(`LOWER(city) LIKE ${GreenSpaces.sequelize.escape(q)}`),
        literal(`LOWER(postal_code) LIKE ${GreenSpaces.sequelize.escape(q)}`),
      ];
    }

    if (city) {
      where.city = city;
    }

    const { count, rows } = await GreenSpaces.findAndCountAll({
      where,
      limit: perPage,
      offset: (page - 1) * perPage,
      order: [['name', 'ASC']],
    });

    if (rows.length === 0) {
      return { spaces: [], total: count };
    }

    const ids = rows.map((s) => s.id);

    const [zoneCounts, sensorCounts, alertCounts] = await Promise.all([
      GreenSpaceZones.findAll({
        attributes: ['green_spaces_id', [fn('COUNT', col('id')), 'count']],
        where: { green_spaces_id: { [Op.in]: ids } },
        group: ['green_spaces_id'],
        raw: true,
      }),
      Sensors.findAll({
        attributes: [
          [col('greenSpaceZone.green_spaces_id'), 'green_spaces_id'],
          [fn('COUNT', col('Sensors.id')), 'count'],
        ],
        include: [
          {
            model: GreenSpaceZones,
            as: 'greenSpaceZone',
            attributes: [],
            required: true,
            where: { green_spaces_id: { [Op.in]: ids } },
          },
        ],
        group: ['greenSpaceZone.green_spaces_id'],
        raw: true,
      }),
      Alerts.findAll({
        attributes: ['green_space_id', [fn('COUNT', col('id')), 'count']],
        where: { green_space_id: { [Op.in]: ids } },
        group: ['green_space_id'],
        raw: true,
      }),
    ]);

    const zoneMap = new Map(zoneCounts.map((r) => [r.green_spaces_id, Number(r.count)]));
    const sensorMap = new Map(sensorCounts.map((r) => [r.green_spaces_id, Number(r.count)]));
    const alertMap = new Map(alertCounts.map((r) => [r.green_space_id, Number(r.count)]));

    const spaces = rows.map((space) => ({
      id: space.id,
      name: space.name,
      city: space.city,
      postal_code: space.postal_code,
      latitude: space.latitude,
      longitude: space.longitude,
      created_at: space.created_at,
      zonesCount: zoneMap.get(space.id) ?? 0,
      sensorsCount: sensorMap.get(space.id) ?? 0,
      activeAlerts: alertMap.get(space.id) ?? 0,
    }));

    return { spaces, total: count };
  }

  static async getSpaceById(spaceId) {
    const space = await GreenSpaces.findByPk(spaceId);

    if (!space) {
      const error = new Error('Space not found');
      error.statusCode = 404;
      throw error;
    }

    return space;
  }

  static async createSpace(data, createdBy) {
    const newSpace = await GreenSpaces.create({
      ...data,
      created_by: createdBy,
      updated_by: createdBy,
    });
    return newSpace;
  }

  static async getCities() {
    const rows = await GreenSpaces.findAll({
      attributes: [[fn('DISTINCT', col('city')), 'city']],
      order: [['city', 'ASC']],
      raw: true,
    });
    return rows.map((r) => r.city).filter(Boolean);
  }

  static async count(options = {}) {
    return GreenSpaces.count(options);
  }
}

export default SpacesService;
