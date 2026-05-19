import SensorSerializer from '../serializers/SpaceSerializer.js';
import SpacesService from '../services/spaces.js';

/**
 * Controller for the spaces routes.
 */
class SensorsController {
  /**
   * Get all sensors.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getSensors(req, res) {
    try {
      const sensors = await SensorsService.getSensors(req.params.spaceId);
      res.json(SensorSerializer.serialize(sensors));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

/**
 * Controller for the spaces routes.
 */
class SensorsController {
  /**
   * Get all sensors.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getSensors(req, res) {
    try {
      const sensors = await SensorsService.getSensors(req.params.spaceId);
      res.json(SensorSerializer.serialize(sensors));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

export default SensorsController;
