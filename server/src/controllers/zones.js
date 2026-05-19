import ZoneSerializer from '../serializers/ZoneSerializer.js';
import ZonesService from '../services/zones.js';

/**
 * Controller for the zones routes.
 */
class ZonesController {
  /**
   * Get all zones.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getSpaceZones(req, res) {
    try {
      const zones = await ZonesService.getZones(req.params.spaceId);
      res.json(ZoneSerializer.serialize(zones));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Get a zone.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getZoneById(req, res) {
    try {
      const zone = await ZonesService.getZoneById(req.params.zoneId);
      res.json(ZoneSerializer.serialize(zone));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Update a zone.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async updateZone(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'No fields provided for update' });
      }
      const updatedZone = await ZonesService.updateZone(req.params.zoneId, req.body);
      res.json(ZoneSerializer.serialize(updatedZone));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Delete a zone.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async deleteZone(req, res) {
    try {
      await ZonesService.deleteZone(req.params.zoneId);
      res.status(204).send();
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

export default ZonesController;