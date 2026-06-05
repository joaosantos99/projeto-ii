import SensorSerializer from '../serializers/SensorSerializer.js';
import SensorsService from '../services/sensors.js';

/**
 * Controller for the sensors routes.
 */
class SensorsController {
  /**
   * Get sensors. Paginated globally or filtered by space when nested under spaces.
   * Pass `summary=true` and/or `distribution=true` to embed the global sensor
   * statistics (independent of the page and filters) in the response.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getSensors(req, res) {
    try {
      if (req.params.spaceId) {
        const sensors = await SensorsService.getSensorsBySpace(req.params.spaceId);
        return res.json(SensorSerializer.serializeForSpace(sensors, req.params.spaceId));
      }

      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, parseInt(req.query.limit) || 20);
      const sort = req.query.sort;
      const offlineOnly = req.query.offlineOnly === 'true';
      const status = req.query.status;
      const type = req.query.type;
      const query = req.query.query;
      const includeSummary = req.query.summary === 'true';
      const includeDistribution = req.query.distribution === 'true';

      const { sensors, total } = await SensorsService.getSensors({ page, limit, sort, offlineOnly, status, type, query });

      const extras = {};
      if (includeSummary) extras.summary = await SensorsService.getSummary();
      if (includeDistribution) extras.distribution = await SensorsService.getDistribution();

      res.json(SensorSerializer.serializePaginated(sensors, { page, limit, total }, extras));
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }

  /**
   * Get a single sensor by id.
   * GET /api/sensors/:sensorId
   */
  static async getSensorById(req, res) {
    try {
      const sensor = await SensorsService.getSensorById(req.params.sensorId);
      res.json(SensorSerializer.serializeWithLinks(sensor));
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }

  /**
   * Register a new sensor. The owning space is derived from the zone; when
   * nested under a space, the zone is also checked to belong to that space.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async createSensor(req, res) {
    try {
      const { zoneId, type, parameter, unit, minValue, maxValue, isActive } = req.body ?? {};
      const errors = {};

      if (!zoneId) errors.zoneId = ['Zona é obrigatória.'];
      if (!type) errors.type = ['Tipo é obrigatório.'];

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ description: 'Invalid request parameters.', errors });
      }

      const zone = await SensorsService.getZoneById(zoneId);
      if (!zone) {
        return res.status(400).json({ description: 'Zona inválida.', errors: { zoneId: ['Zona inválida.'] } });
      }
      if (req.params.spaceId && zone.green_spaces_id !== req.params.spaceId) {
        return res.status(400).json({ description: 'Zona inválida para este espaço.', errors: { zoneId: ['Zona inválida.'] } });
      }

      const sensor = await SensorsService.createSensor({
        green_space_zone_id: zoneId,
        type,
        parameter: parameter ?? type,
        unit,
        min_value: minValue ?? 0,
        max_value: maxValue ?? 0,
        is_active: isActive ?? true,
        created_by: req.user.id,
        updated_by: req.user.id,
      });

      const fresh = await SensorsService.getSensorById(sensor.id);
      res.status(201).json(SensorSerializer.serializeWithLinks(fresh));
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }

  static async getSpacesSummary(req, res) {
    try {
      const count = await SensorsService.count();
      res.json({ count });
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }

  static async updateSensor(req, res) {
    try {
      const { zoneId, type, parameter, unit, minValue, maxValue, isActive } = req.body ?? {};

      const sensor = await SensorsService.updateSensor(req.params.sensorId, {
        green_space_zone_id: zoneId,
        type,
        parameter,
        unit,
        min_value: minValue,
        max_value: maxValue,
        is_active: isActive,
        updated_by: req.user.id,
      });

      res.json(SensorSerializer.serializeWithLinks(sensor));
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }

  static async deleteSensor(req, res) {
    try {
      await SensorsService.deleteSensor(req.params.sensorId);
      res.status(204).send();
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }
}

export default SensorsController;
