import GreenSpaceZones from '../database/models/GreenSpaceZones.js';

/**
 * Service for the green space zones routes.
 */
class ZonesService {
  /**
   * Get all zones.
   * @returns {Promise<Array<User>>} - The zones.
   */
  static async getZones(spaceId) {
    const zones = await GreenSpaceZones.findAll({
      where: { green_spaces_id: spaceId },
      order: [['created_at', 'ASC']],
    });

    return zones;
  }

  /**
   * Create a zone.
   * @returns {Promise<Array<GreenSpaceZones>>} - The zones.
   */
  static async createZone(data) {
    const zone = await GreenSpaceZones.create(data);
    return zone;
  }

  /**
   * Update a zone.
   * @returns {Promise<Array<GreenSpaceZones>>} - The zones.
   */
  static async updateZone(zoneId, data) {
    const zone = await GreenSpaceZones.findByPk(zoneId);

    if (!zone) {
      const error = new Error('Zone not found');
      error.statusCode = 404;
      throw error;
    }

    const updatedZone = await zone.update(data);
    return updatedZone;
  }

  /**
   * Delete a zone.
   * @returns {Promise<Array<GreenSpaceZones>>} - The zones.
   */
  static async deleteZone(zoneId) {
    const zone = await GreenSpaceZones.findByPk(zoneId);

    if (!zone) {
      const error = new Error('Zone not found');
      error.statusCode = 404;
      throw error;
    }

    await zone.destroy();
  }

  static async count(options = {}) {
    return GreenSpaceZones.count(options);
  }
}

export default ZonesService;