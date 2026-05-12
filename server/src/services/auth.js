import Users from '../database/models/Users.js';
import Roles from '../database/models/Roles.js';

/**
 * Service for the auth routes.
 */
class AuthService {
  /**
   * Get the authenticated user by id, with role eager-loaded.
   * @param {string} userId - The authenticated user's id.
   * @returns {Promise<User>} - The user.
   */
  static async getMe(userId) {
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
}

export default AuthService;
