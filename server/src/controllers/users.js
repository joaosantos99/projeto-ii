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

  /**
   * Update a user's data.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async updateUser(req, res) {
    try {
      const { fullName, email, password, role } = req.body ?? {};
      const errors = {};

      if (email !== undefined && !email.includes('@')) {
        errors.email = ['Email must contain @.'];
      }

      if (password !== undefined && password.length < 10) {
        errors.password = ['Password must be at least 10 characters.'];
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ description: 'Invalid request parameters.', errors });
      }

      const user = await UsersService.updateUser(
        req.params.userId,
        { fullName, email, password, role },
        req.user.id,
      );

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

  /**
   * Soft-delete a user by id.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async deleteUser(req, res) {
    try {
      await UsersService.deleteUser(req.params.userId, req.user.id);

      res.status(204).json({ message: 'Utilizador eliminado com sucesso.' });
    } catch (error) {
      res.status(error.statusCode || 500).json({ description: error.message });
    }
  }
}

export default UsersController;
