import GreenSpaceZones from '../database/models/GreenSpaceZones.js';
import Sensors from '../database/models/Sensors.js';

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

  static async createSensor(data) {
    return Sensors.create(data);
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
}

export default SensorsService;
