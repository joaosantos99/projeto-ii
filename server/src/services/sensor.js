import { Op } from 'sequelize';

import GreenSpaces from '../database/models/GreenSpaces.js';
import Sensors from '../database/models/Sensors.js';

const SENSOR_TYPES = ['temperature', 'humidity', 'light', 'sound'];

/**
 * Service for the sensors routes.
 */
class SensorsService {

  /**
   * Get a summary of sensor stats.
   * Counts total, active and inactive sensors.
   * @returns {Promise<Object>} The summary object.
   */
  static async getSummary() {
    const totalSensors = await Sensors.count();
    const totalActive = await Sensors.count({ where: { is_active: true } });
    const totalNeedsAttention = await Sensors.count({ where: { is_active: false } });

    return {
      totalSensors,
      totalActive,
      totalNeedsAttention,
      lowBattery: 0, // placeholder — no battery field in current model
    };
  }

  /**
   * Get the distribution of sensors by status (online / degraded / offline).
   * @returns {Promise<Object>} The distribution object.
   */
  static async getDistribution() {
    const totalSensors = await Sensors.count();
    const online = await Sensors.count({ where: { is_active: true } });
    const offline = await Sensors.count({ where: { is_active: false } });

    return {
      online,
      degraded: 0, // placeholder — no degraded status in current model
      offline,
      totalSensors,
    };
  }

  /**
   * Get a paginated and optionally sorted list of sensors.
   * @param {Object} options
   * @param {number} options.page - Page number (default 1).
   * @param {number} options.limit - Items per page (default 20).
   * @param {string} [options.sort] - Sort string, e.g. "created_at:desc".
   * @returns {Promise<Object>} Object with sensors array and total count.
   */
  static async getSensors({ page = 1, limit = 20, sort } = {}) {
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

    const { count: total, rows: sensors } = await Sensors.findAndCountAll({
      order,
      limit,
      offset,
    });

    return { sensors, total };
  }

  /**
   * Register a new sensor for a given space.
   * @param {string} spaceId - The green space UUID.
   * @param {Object} data - The sensor payload.
   * @returns {Promise<Sensors>} The created sensor.
   */
  static async createSensor(spaceId, data) {
    const space = await GreenSpaces.findByPk(spaceId);
    if (!space) {
      const error = new Error('Space not found');
      error.statusCode = 404;
      throw error;
    }

    if (!SENSOR_TYPES.includes(data.type)) {
      const error = new Error(`Invalid type. Must be one of: ${SENSOR_TYPES.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    const sensor = await Sensors.create({
      green_space_zone_id: data.green_space_zone_id,
      type: data.type,
      parameter: data.parameter,
      min_value: data.min_value ?? null,
      max_value: data.max_value ?? null,
      is_active: data.is_active ?? true,
      created_by: data.created_by,
      updated_by: data.created_by,
    });

    return sensor;
  }
}

export default SensorsService;