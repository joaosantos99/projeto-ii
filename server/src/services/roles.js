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
}

export default RolesService;
