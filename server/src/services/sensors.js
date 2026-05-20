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
}

export default SensorsService;
