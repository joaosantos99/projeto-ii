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
}

export default UsersService;
