import SensorSerializer from '../serializers/SensorSerializer.js';
import SensorsService from '../services/sensors.js';

/**
 * Controller for the sensors routes.
 */
class SensorsController {

  /**
   * Get a summary of sensor stats.
   * GET /api/sensors/summary
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getSummary(req, res) {
    try {
      const summary = await SensorsService.getSummary();

      res.json(SensorSerializer.serializeSummary(summary));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Get sensor distribution by status.
   * GET /api/sensors/distribution
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getDistribution(req, res) {
    try {
      const distribution = await SensorsService.getDistribution();

      res.json(SensorSerializer.serializeDistribution(distribution));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Get paginated list of sensors.
   * GET /api/sensors
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getSensors(req, res) {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, parseInt(req.query.limit) || 20);
      const sort = req.query.sort;

      const { sensors, total } = await SensorsService.getSensors({ page, limit, sort });

      res.json(SensorSerializer.serializePaginated(sensors, { page, limit, total }));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Register a new sensor for a space.
   * POST /api/spaces/:spaceId/sensors/:sensorId
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async createSensor(req, res) {
    try {
      const sensor = await SensorsService.createSensor(req.params.spaceId, req.body);

      res.status(201).json({ data: SensorSerializer.serializeOne(sensor) });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

export default SensorsController;