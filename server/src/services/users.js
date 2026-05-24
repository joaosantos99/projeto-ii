import { Op, fn, col, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
import Users from '../database/models/Users.js';
import Roles from '../database/models/Roles.js';
import Sessions from '../database/models/Sessions.js';

/**
 * Service for the users routes.
 */
class UsersService {
  /**
   * Get paginated and filtered users.
   * @param {Object} options
   * @param {number} options.page
   * @param {number} options.perPage
   * @param {string} [options.query]
   * @param {string} [options.role]
   * @param {string} [options.status]
   * @returns {Promise<{users: Array<User>, total: number, activeIds: Array<string>}>}
   */
  static async getUsers({ page = 1, perPage = 10, query, role, status } = {}) {
    const where = {};
    const include = [{ model: Roles, as: 'role' }];

    if (query) {
      const q = `%${query}%`;
      where[Op.or] = [
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('full_name')), { [Op.like]: q.toLowerCase() }),
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), { [Op.like]: q.toLowerCase() }),
      ];
    }

    if (role) {
      include[0].where = { name: role };
    }

    const activeRows = await Sessions.findAll({
      attributes: [[fn('DISTINCT', col('user_id')), 'user_id']],
      where: { expires_at: { [Op.gt]: new Date() } },
      raw: true,
    });
    const activeIds = activeRows.map((r) => r.user_id);

    if (status === 'ativo') {
      if (activeIds.length === 0) {
        return { users: [], total: 0, activeIds: [] };
      }
      where.id = { [Op.in]: activeIds };
    } else if (status === 'suspenso') {
      if (activeIds.length > 0) {
        where.id = { [Op.notIn]: activeIds };
      }
    }

    const { count, rows } = await Users.findAndCountAll({
      where,
      include,
      limit: perPage,
      offset: (page - 1) * perPage,
      distinct: true,
    });

    return { users: rows, total: count, activeIds };
  }

  /**
   * Get a user by id, with role eager-loaded.
   * @param {string} userId - The user's uuid.
   * @returns {Promise<User>} - The user.
   */
  static async getUserById(userId) {
    const user = await Users.findByPk(userId, {
      include: [{ model: Roles, as: 'role' }],
    });

    if (!user) {
      const error = new Error('Utilizador não encontrado');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  /**
   * Soft-delete a user by id, recording who deleted it.
   * @param {string} userId - The user's uuid.
   * @param {string} deletedBy - The authenticated user's uuid.
   */
  static async deleteUser(userId, deletedBy) {
    const user = await Users.findByPk(userId);

    if (!user) {
      const error = new Error('Utilizador não encontrado');
      error.statusCode = 404;
      throw error;
    }

    await user.update({ deleted_by: deletedBy });
    await user.destroy();
  }

  /**
   * Update a user's data.
   * @param {string} userId - The user's uuid.
   * @param {Object} data - Fields to update: fullName, email, password, role (name).
   * @param {string} updatedBy - The authenticated user's uuid.
   * @returns {Promise<User>} - The updated user with role eager-loaded.
   */
  static async updateUser(userId, data, updatedBy) {
    const user = await Users.findByPk(userId);

    if (!user) {
      const error = new Error('Utilizador não encontrado');
      error.statusCode = 404;
      throw error;
    }

    const changes = { updated_by: updatedBy };

    if (data.fullName !== undefined) {
      changes.full_name = data.fullName;
    }

    if (data.email !== undefined) {
      const conflict = await Users.findOne({
        where: { email: data.email, id: { [Op.ne]: userId } },
      });
      if (conflict) {
        const error = new Error('Email já está em uso.');
        error.statusCode = 409;
        throw error;
      }
      changes.email = data.email;
    }

    if (data.password !== undefined) {
      changes.password_hash = await bcrypt.hash(data.password, 12);
    }

    if (data.role !== undefined) {
      const role = await Roles.findOne({ where: { name: data.role } });
      if (!role) {
        const error = new Error('Perfil não encontrado.');
        error.statusCode = 404;
        throw error;
      }
      changes.role_id = role.id;
    }

    await user.update(changes);

    return user.reload({ include: [{ model: Roles, as: 'role' }] });
  }

  /**
   * Create a new user.
   * @param {Object} data - fullName, email, password, role (name).
   * @param {string} createdBy - The authenticated user's uuid.
   * @returns {Promise<User>} - The created user with role eager-loaded.
   */
  static async createUser(data, createdBy) {
    const existing = await Users.findOne({ where: { email: data.email } });
    if (existing) {
      const error = new Error('Já existe um utilizador com esse email.');
      error.statusCode = 409;
      throw error;
    }

    const role = await Roles.findOne({ where: { name: data.role } });
    if (!role) {
      const error = new Error('Perfil não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const user = await Users.create({
      full_name: data.fullName,
      email: data.email,
      password_hash: await bcrypt.hash(data.password, 12),
      role_id: role.id,
      created_by: createdBy,
      updated_by: createdBy,
    });

    return user.reload({ include: [{ model: Roles, as: 'role' }] });
  }

  /**
   * Return a statistical summary of platform users.
   * - total: all non-deleted users
   * - active: users with at least one non-expired session
   * - suspended: total - active
   * - accessToday: users with a session created today (UTC)
   * @returns {Promise<{ total, active, suspended, accessToday }>}
   */
  static async getSummary() {
    const now = new Date();
    const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    const [total, activeRows, accessTodayRows, adminCount] = await Promise.all([
      Users.count(),

      Sessions.findAll({
        attributes: [[fn('DISTINCT', col('user_id')), 'user_id']],
        where: { expires_at: { [Op.gt]: now } },
        raw: true,
      }),

      Sessions.findAll({
        attributes: [[fn('DISTINCT', col('user_id')), 'user_id']],
        where: { created_at: { [Op.gte]: todayStart } },
        raw: true,
      }),

      Users.count({
        include: [{ model: Roles, as: 'role', where: { name: 'admin' } }],
      }),
    ]);

    const active = activeRows.length;

    return {
      total,
      active,
      suspended: total - active,
      accessToday: accessTodayRows.length,
      adminCount,
    };
  }
}

export default UsersService;
