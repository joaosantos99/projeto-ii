import Roles from '../database/models/Roles.js';

/**
 * Service for the roles routes.
 */
class RolesService {
  /**
   * Get all roles.
   * @returns {Promise<Array<Role>>} - The roles.
   */
  static async getRoles() {
    return Roles.findAll({ order: [['created_at', 'ASC']] });
  }

  /**
   * Create a new role.
   * @param {Object} data - name, permissions (array).
   * @param {string} createdBy - The authenticated user's uuid.
   * @returns {Promise<Role>} - The created role.
   */
  static async createRole(data, createdBy) {
    const existing = await Roles.findOne({ where: { name: data.name } });
    if (existing) {
      const error = new Error('Já existe um perfil com esse nome.');
      error.statusCode = 409;
      throw error;
    }

    const role = await Roles.create({
      name: data.name,
      permissions: Array.isArray(data.permissions) ? data.permissions : [],
      created_by: createdBy,
      updated_by: createdBy,
    });

    return role;
  }

  /**
   * Toggle a single permission on a role. Adds it if missing, removes it if present.
   * @param {string} roleId - The role's uuid.
   * @param {string} permissionId - The permission identifier to toggle.
   * @param {string} updatedBy - The authenticated user's uuid.
   * @returns {Promise<Role>} - The updated role.
   */
  static async updateRolePermission(roleId, permissionId, updatedBy) {
    const role = await Roles.findByPk(roleId);

    if (!role) {
      const error = new Error('Role não encontrado');
      error.statusCode = 404;
      throw error;
    }

    const current = role.permissions ?? [];
    const next = current.includes(permissionId)
      ? current.filter((p) => p !== permissionId)
      : [...current, permissionId];

    await role.update({ permissions: next, updated_by: updatedBy });

    return role;
  }
}

export default RolesService;
