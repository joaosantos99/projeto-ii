import RolesService from '../services/roles.js';
import RoleSerializer from '../serializers/RoleSerializer.js';

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
      res.json(RoleSerializer.serializeCollection(roles));
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

      res.status(201).location(`/api/roles/${role.id}`).json(RoleSerializer.serializeWithLinks(role));
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }

  /**
   * Grant a permission to a role (idempotent).
   * PUT /api/roles/:roleId/permissions/:permissionId
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async grantPermission(req, res) {
    try {
      const role = await RolesService.setRolePermission(
        req.params.roleId,
        req.params.permissionId,
        true,
        req.user.id,
      );
      res.json(RoleSerializer.serializeWithLinks(role));
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }

  /**
   * Revoke a permission from a role (idempotent).
   * DELETE /api/roles/:roleId/permissions/:permissionId
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async revokePermission(req, res) {
    try {
      await RolesService.setRolePermission(
        req.params.roleId,
        req.params.permissionId,
        false,
        req.user.id,
      );
      res.status(204).send();
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }
}

export default RolesController;
