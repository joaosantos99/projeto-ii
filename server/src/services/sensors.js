import Sensors from '../database/models/Sensors.js';

/**
 * Service for the sensors routes.
 */
class SensorsService {
  static async count(options = {}) {
    return Sensors.count(options);
  }
}

export default SensorsService;
