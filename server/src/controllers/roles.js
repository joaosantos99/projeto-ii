import RolesService from '../services/roles.js';

/**
 * Controller for the roles routes.
 */
class RolesController {
  /**
   * Create a new role.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async createRole(req, res) {
    try {
      const { name, description, permissions } = req.body ?? {};
      const errors = {};

      if (!name) errors.name = ['Name is mandatory.'];
      if (!description) errors.description = ['Description is mandatory.'];

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ description: 'Invalid request parameters.', errors });
      }

      const role = await RolesService.createRole({ name, permissions }, req.user.id);

      res.status(200).json({
        id: role.id,
        name: role.name,
        permissionsDump: role.permissions,
        createdAt: new Date(role.created_at).toISOString(),
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }
}

export default RolesController;
