import GreenSpaces from '../database/models/GreenSpaces.js';

/**
 * Service for the spaces routes.
 */
class SpacesService {
  /**
   * Get all spaces.
   * @returns {Promise<Array<User>>} - The spaces.
   */
  static async getSpaces() {
    const spaces = await GreenSpaces.findAll();

    if (!spaces.length) {
      const error = new Error('No spaces found');
      error.statusCode = 404;
      throw error;
    }

    return spaces;
  }

  static async getSpaceById(spaceId) {
    const space = await GreenSpaces.findByPk(spaceId)

    if (!space) {
      const error = new Error('Space not found');
      error.statusCode = 404;
      throw error;
    }

    return space;
  }

  static async createSpace(data) {
    const newSpace = await GreenSpaces.create(data);
    return newSpace;
  }

  static async count(options = {}) {
    return GreenSpaces.count(options);
  }
}

export default SpacesService;
