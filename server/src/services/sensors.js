import GreenSpaceZones from '../database/models/GreenSpaceZones.js';
import GreenSpaces from '../database/models/GreenSpaces.js';
import Sensors from '../database/models/Sensors.js';
import { SENSOR_TYPES, normalizeSensorUnits } from '../lib/units.js';

/**
 * Service for the sensors routes.
 */
class SensorsService {
  static async count(options = {}) {
    return Sensors.count(options);
  }

  static async getSensorsBySpace(spaceId) {
    return Sensors.findAll({
      include: [
        {
          model: GreenSpaceZones,
          as: 'greenSpaceZone',
          attributes: ['id', 'name', 'green_spaces_id'],
          required: true,
          where: { green_spaces_id: spaceId },
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  static async getZoneById(zoneId) {
    return GreenSpaceZones.findByPk(zoneId);
  }

  /**
   * Get a summary of sensor stats.
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
      lowBattery: 0,
    };
  }

  /**
   * Get the distribution of sensors by status.
   * @returns {Promise<Object>} The distribution object.
   */
  static async getDistribution() {
    const totalSensors = await Sensors.count();
    const online = await Sensors.count({ where: { is_active: true } });
    const offline = await Sensors.count({ where: { is_active: false } });

    return {
      online,
      degraded: 0,
      offline,
      totalSensors,
    };
  }

  /**
   * Get a paginated and optionally sorted list of sensors.
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
   * Register a new sensor.
   * Supports both the nested-spaces signature (spaceId, data) and the
   * flat signature (data) used by the in-space controller.
   * @returns {Promise<Sensors>} The created sensor.
   */
  static async createSensor(spaceIdOrData, maybeData) {
    if (typeof spaceIdOrData === 'string') {
      const spaceId = spaceIdOrData;
      const data = maybeData ?? {};

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

      const normalized = normalizeSensorUnits({
        type: data.type,
        unit: data.unit,
        min_value: data.min_value ?? null,
        max_value: data.max_value ?? null,
      });

      return Sensors.create({
        green_space_zone_id: data.green_space_zone_id,
        type: data.type,
        parameter: data.parameter,
        unit: normalized.unit,
        min_value: normalized.min_value,
        max_value: normalized.max_value,
        is_active: data.is_active ?? true,
        created_by: data.created_by,
        updated_by: data.created_by,
      });
    }

    const data = spaceIdOrData;
    if (data?.type) {
      const normalized = normalizeSensorUnits({
        type: data.type,
        unit: data.unit,
        min_value: data.min_value,
        max_value: data.max_value,
      });
      return Sensors.create({
        ...data,
        unit: normalized.unit,
        min_value: normalized.min_value,
        max_value: normalized.max_value,
      });
    }

    return Sensors.create(data);
  }
}

export default SensorsService;
