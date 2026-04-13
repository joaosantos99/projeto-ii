import SpaceSerializer from '../serializers/SpaceSerializer.js';
import SpacesService from '../services/spaces.js';

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
      const space = await SpacesService.getSpaceById(req.params.spaceId)
      
      res.json(SpaceSerializer.serialize(space))
    } catch (error) {
      res.status(error.statusCode || 500).json({error: error.message});
    }
  }

  /**
  * Create a space.
  * @param {Object} req - The request object.
  * @param {Object} res - The response object.
  */
  static async createSpace(req, res) {
    try {
      const newSpace = await SpacesService.createSpace(req.body)

      res.status(201).json(SpaceSerializer.serialize(newSpace));
    } catch (error) {
      res.status(error.statusCode || 500).json({error: error.message});
    }
  }
}

export default SpacesController;
