import PermissionSerializer from '../serializers/PermissionSerializer.js';
import { PERMISSIONS } from '../constants/permissions.js';

/**
 * Controller for the permissions routes.
 */
class PermissionsController {
  /**
   * Return the catalog of all known permission identifiers.
   * GET /api/permissions
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getPermissions(req, res) {
    try {
      res.json(PermissionSerializer.serializeCollection(Object.values(PERMISSIONS)));
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }
}

export default PermissionsController;
