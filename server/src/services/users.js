import { Op } from 'sequelize';
import Users from '../database/models/Users.js';
import Roles from '../database/models/Roles.js';

/**
 * Service for the users routes.
 */
class UsersService {
  /**
   * Get all users.
   * @returns {Promise<Array<User>>} - The users.
   */
  static async getUsers() {
    const users = await Users.findAll();

    if (!users) {
      throw new Error({ statusCode: 404, message: 'No users found' });
    }

    return users;
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
      changes.password_hash = data.password;
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
      password_hash: data.password,
      role_id: role.id,
      created_by: createdBy,
      updated_by: createdBy,
    });

    return user.reload({ include: [{ model: Roles, as: 'role' }] });
  }
}

export default UsersService;
