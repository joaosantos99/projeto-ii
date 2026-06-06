import Roles from '../database/models/Roles.js';
import Users from '../database/models/Users.js';
import CacheService from './cache.js';

const sessionCache = new CacheService({
  namespace: 'session',
  indexNamespace: 'user-sessions',
  label: 'session-cache',
});

/**
 * Service for the roles routes.
 */
class RolesService {
  /**
   * Get all roles.
   * @returns {Promise<Array<Role>>} - The roles.
   */
  static async getRoles() {
    const roles = await Roles.findAll({ order: [['created_at', 'ASC']] });

    const counts = await Users.findAll({
      attributes: [
        'role_id',
        [Users.sequelize.fn('COUNT', Users.sequelize.col('id')), 'count'],
      ],
      group: ['role_id'],
      raw: true,
    });

    const countByRole = counts.reduce((acc, row) => {
      acc[row.role_id] = Number(row.count);
      return acc;
    }, {});

    return roles.map((role) => {
      role.setDataValue('userCount', countByRole[role.id] ?? 0);
      return role;
    });
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
   * Grant or revoke a single permission on a role. Idempotent: granting an
   * already-present permission (or revoking an absent one) is a no-op that
   * still resolves to the role.
   * @param {string} roleId - The role's uuid.
   * @param {string} permissionId - The permission identifier.
   * @param {boolean} enabled - True to grant, false to revoke.
   * @param {string} updatedBy - The authenticated user's uuid.
   * @returns {Promise<Role>} - The (possibly unchanged) role.
   */
  static async setRolePermission(roleId, permissionId, enabled, updatedBy) {
    const role = await Roles.findByPk(roleId);

    if (!role) {
      const error = new Error('Role não encontrado');
      error.statusCode = 404;
      throw error;
    }

    const current = role.permissions ?? [];
    const has = current.includes(permissionId);
    const next = enabled
      ? (has ? current : [...current, permissionId])
      : (has ? current.filter((p) => p !== permissionId) : current);

    // Nothing to do — the role already matches the requested state.
    if (next === current) {
      return role;
    }

    await role.update({ permissions: next, updated_by: updatedBy });

    const users = await Users.findAll({ where: { role_id: roleId }, attributes: ['id'] });
    await Promise.all(users.map((u) => sessionCache.invalidateIndex(u.id)));

    return role;
  }
}

export default RolesService;
