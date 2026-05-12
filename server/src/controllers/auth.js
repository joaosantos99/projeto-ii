import UserSerializer from '../serializers/UserSerializer.js';
import AuthService from '../services/auth.js';

/**
 * Controller for the auth routes.
 */
class AuthController {

  /**
   * Get the currently authenticated user.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async getMe(req, res) {
    try {
      const user = await AuthService.getMe(req.user.id);
      const roles = user.role ? [user.role] : [];

      res.json(UserSerializer.serialize(user, { roles }));
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ description: error.message });
    }
  }
}

export default AuthController;
