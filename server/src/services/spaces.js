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

    if (!spaces) {
      throw new Error({ statusCode: 404, message: 'No spaces found' });
    }

    return spaces;
  }

  static async getSpaceById(spaceId) {
    const space = await GreenSpaces.findByPK(spaceId)

    if (!space) {
      throw new Error({ statusCode: 404, message: `Space not found` });
    }

    return space;
  }

  static async createSpace(data) {
    const newSpace = await GreenSpaces.create(data);
    return newSpace;
  }
}

export default SpacesService;
