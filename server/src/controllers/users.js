import UserSerializer from '../serializers/UserSerializer.js';
import UsersService from '../services/users.js';

/**
 * Controller for the users routes.
 */
class UsersController {

  /**
   * Get all users.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getUsers(req, res) {
    try {
      const users = await UsersService.getUsers();

      res.json(UserSerializer.serialize(users));
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Get a user by id.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getUserById(req, res) {
    try {
      const user = await UsersService.getUserById(req.params.userId);

      res.json({
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role?.name ?? null,
        createdAt: new Date(user.created_at).toISOString(),
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }
}

export default UsersController;
