import SensorSerializer from '../serializers/SensorSerializer.js';
import SensorsService from '../services/sensors.js';

class SensorsController {
  static async getSensors(req, res) {
    try {
      const sensors = [];
      res.json(SensorSerializer.serialize(sensors));
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
