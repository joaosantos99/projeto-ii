import SpaceSerializer from '../serializers/SpaceSerializer.js';
import SensorsService from '../services/sensors.js';
import SpacesService from '../services/spaces.js';
import ZonesService from '../services/zones.js';

/**
 * Controller for the spaces routes.
 */
class SpacesController {
  /**
   * Get all spaces.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getSpaces(req, res) {
    try {
      const spaces = await SpacesService.getSpaces();

      res.json(SpaceSerializer.serialize(spaces));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Get a space.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getSpaceById(req, res) {
    try {
      const space = await SpacesService.getSpaceById(req.params.spaceId);

      res.json(SpaceSerializer.serialize(space));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Create a space.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async createSpace(req, res) {
    try {
      const newSpace = await SpacesService.createSpace(req.body);

      res.status(201).json(SpaceSerializer.serialize(newSpace));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Get spaces summary.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getSpacesSummary(req, res) {
    try {
      const spacesCount = await SpacesService.count();
      const zonesCount = await ZonesService.count();
      const activeCount = await SensorsService.count({ where: { is_active: true } });
      const districtsCount = await SpacesService.count({distinct: true, col: 'city'});

      const summary = {
        spacesCount,
        zonesCount,
        activeCount,
        districtsCount
      }
      
      res.json(summary);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Update a space.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async updateSpace(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'No fields provided for update' });
      }

      const space = await SpacesService.getSpaceById(req.params.spaceId);
      const { name, city, postal_code, latitude, longitude } = req.body;
      const updatedSpace = await space.update({ name, city, postal_code, latitude, longitude });

      res.json(SpaceSerializer.serialize(updatedSpace));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
  
}

export default SpacesController;
