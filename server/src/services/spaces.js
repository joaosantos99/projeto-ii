import { Op, fn, col, literal } from 'sequelize';

import GreenSpaces from '../database/models/GreenSpaces.js';
import GreenSpaceZones from '../database/models/GreenSpaceZones.js';
import Sensors from '../database/models/Sensors.js';
import SensorReadingMetas from '../database/models/SensorReadingMetas.js';
import Alerts from '../database/models/Alerts.js';
import Reports from '../database/models/Reports.js';
import { SENSOR_TYPES } from '../lib/units.js';

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
   * @param {string} [options.parish]
   * @returns {Promise<{spaces: Array<Object>, total: number}>}
   */
  static async getSpaces({ page = 1, perPage = 10, query, parish } = {}) {
    const where = {};

    if (query) {
      const q = `%${query.toLowerCase()}%`;
      where[Op.or] = [
        literal(`LOWER(name) LIKE ${GreenSpaces.sequelize.escape(q)}`),
        literal(`LOWER(parish) LIKE ${GreenSpaces.sequelize.escape(q)}`),
        literal(`LOWER(postal_code) LIKE ${GreenSpaces.sequelize.escape(q)}`),
      ];
    }

    if (parish) {
      where.parish = parish;
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
      parish: space.parish,
      postal_code: space.postal_code,
      image_url: space.image_url,
      latitude: space.latitude,
      longitude: space.longitude,
      created_at: space.created_at,
      zonesCount: zoneMap.get(space.id) ?? 0,
      sensorsCount: sensorMap.get(space.id) ?? 0,
      activeAlerts: alertMap.get(space.id) ?? 0,
    }));

    return { spaces, total: count };
  }

  static async getSpaceById(spaceId, { includeZones = false, includeSensors = false, includeReports = false } = {}) {
    const include = [];

    if (includeZones) {
      const zoneInclude = { model: GreenSpaceZones, as: 'zones' };
      if (includeSensors) {
        zoneInclude.include = [{ model: Sensors, as: 'sensors' }];
      }
      include.push(zoneInclude);
    }

    if (includeReports) {
      include.push({ model: Reports, as: 'reports' });
    }

    const space = await GreenSpaces.findByPk(spaceId, include.length > 0 ? { include } : {});

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

  /**
   * Persist a new image URL on a space.
   * @param {string} spaceId
   * @param {string} imageUrl
   * @param {string} updatedBy - User id performing the update.
   * @returns {Promise<Object>} The updated space.
   */
  static async setImageUrl(spaceId, imageUrl, updatedBy) {
    const space = await SpacesService.getSpaceById(spaceId);
    return space.update({ image_url: imageUrl, updated_by: updatedBy });
  }

  static async getParishes() {
    const rows = await GreenSpaces.findAll({
      attributes: [[fn('DISTINCT', col('parish')), 'parish']],
      order: [['parish', 'ASC']],
      raw: true,
    });
    return rows.map((r) => r.parish).filter(Boolean);
  }

  static async count(options = {}) {
    return GreenSpaces.count(options);
  }

  /**
   * Per-space status of each sensor type, derived from the latest reading.
   *
   * For every space and every sensor type, the sensor with the most recent
   * reading (max recorded_at) wins; its `is_active` flag becomes the type's
   * status. Types with no readings report `isActive: false` / `lastReadingAt: null`.
   * @param {Array<string>} ids - Green space ids.
   * @returns {Promise<Map<string, Object>>} Map of space id to a `{type: {isActive, lastReadingAt}}` object.
   */
  static async getSensoresStatusBySpaceIds(ids) {
    const statusMap = new Map();
    if (!ids || ids.length === 0) return statusMap;

    // Last reading time per (space, sensor) — bounded by the number of sensors.
    const lastReadings = await SensorReadingMetas.findAll({
      attributes: [
        'green_space_id',
        'sensor_id',
        [fn('MAX', col('recorded_at')), 'last_reading_at'],
      ],
      where: { green_space_id: { [Op.in]: ids } },
      group: ['green_space_id', 'sensor_id'],
      raw: true,
    });

    const sensorIds = [...new Set(lastReadings.map((r) => r.sensor_id))];
    const sensors = sensorIds.length
      ? await Sensors.findAll({
          attributes: ['id', 'type', 'is_active'],
          where: { id: { [Op.in]: sensorIds } },
          raw: true,
        })
      : [];
    const sensorMap = new Map(sensors.map((s) => [s.id, s]));

    // Pick the latest-read sensor per (space, type).
    const picked = new Map();
    for (const row of lastReadings) {
      const sensor = sensorMap.get(row.sensor_id);
      if (!sensor) continue;
      const key = `${row.green_space_id}|${sensor.type}`;
      const current = picked.get(key);
      if (!current || new Date(row.last_reading_at) > new Date(current.recordedAt)) {
        picked.set(key, { recordedAt: row.last_reading_at, isActive: Boolean(sensor.is_active) });
      }
    }

    for (const id of ids) {
      const status = {};
      for (const type of SENSOR_TYPES) {
        const hit = picked.get(`${id}|${type}`);
        status[type] = {
          isActive: hit ? hit.isActive : false,
          lastReadingAt: hit ? new Date(hit.recordedAt).toISOString() : null,
        };
      }
      statusMap.set(id, status);
    }

    return statusMap;
  }
}

export default SpacesService;
