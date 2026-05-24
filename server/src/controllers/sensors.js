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

  static async getSensors(req, res) {
    try {
      const sensors = await SensorsService.getSensorsBySpace(req.params.spaceId);
      res.json(SensorSerializer.serialize(sensors));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  static async createSensor(req, res) {
    try {
      const { zoneId, type, parameter, minValue, maxValue, isActive } = req.body ?? {};
      const errors = {};

      if (!zoneId) errors.zoneId = ['Zona é obrigatória.'];
      if (!type) errors.type = ['Tipo é obrigatório.'];

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ description: 'Invalid request parameters.', errors });
      }

      const zone = await SensorsService.getZoneById(zoneId);
      if (!zone || zone.green_spaces_id !== req.params.spaceId) {
        return res.status(400).json({ description: 'Zona inválida para este espaço.', errors: { zoneId: ['Zona inválida.'] } });
      }

      const sensor = await SensorsService.createSensor({
        green_space_zone_id: zoneId,
        type,
        parameter: parameter ?? type,
        min_value: minValue ?? 0,
        max_value: maxValue ?? 0,
        is_active: isActive ?? true,
        created_by: req.user.id,
        updated_by: req.user.id,
      });

      const created = await SensorsService.getSensorsBySpace(req.params.spaceId);
      const fresh = created.find((s) => s.id === sensor.id) ?? sensor;
      res.status(201).json(SensorSerializer.serialize(fresh));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  static async getSpacesSummary(req, res) {
    try {
      const count = await SensorsService.count();
      res.json({ count });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  static async updateSensor(req, res) {
    res.status(501).json({ error: 'Not implemented' });
  }

  static async deleteSensor(req, res) {
    res.status(501).json({ error: 'Not implemented' });
  }
}

export default SensorsController;
