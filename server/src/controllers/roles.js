import RolesService from '../services/roles.js';
import { PERMISSIONS } from '../constants/permissions.js';

/**
 * Controller for the roles routes.
 */
class RolesController {
  /**
   * Get all roles.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getRoles(req, res) {
    try {
      const roles = await RolesService.getRoles();

      res.json(
        roles.map((role) => ({
          id: role.id,
          name: role.name,
          permissionsDump: role.permissions,
          userCount: role.getDataValue('userCount') ?? 0,
          createdAt: new Date(role.created_at).toISOString(),
        })),
      );
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }

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

  /**
   * Return the list of all known permission identifiers.
   * Shape: [{ id: 'users:read', resource: 'users', action: 'read' }, ...]
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getPermissionsCatalog(req, res) {
    try {
      const catalog = Object.values(PERMISSIONS).map((id) => {
        const [resource, action] = id.split(':');
        return { id, resource, action };
      });
      res.json(catalog);
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }

  /**
   * Update (toggle) a permission for a role.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async updateRolePermission(req, res) {
    try {
      const { permissionId } = req.body ?? {};

      if (!permissionId) {
        return res.status(400).json({
          description: 'Invalid request parameters.',
          errors: { permissionId: ['permissionId is mandatory.'] },
        });
      }

      await RolesService.updateRolePermission(req.params.roleId, permissionId, req.user.id);

      res.status(200).json({ permissionId });
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }
}

export default RolesController;
