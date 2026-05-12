import AuthService from '../services/auth.js';
import UserSerializer from '../serializers/UserSerializer.js';

const VALID_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  /**
   * Authenticate a user with email and password, returning a session token.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body ?? {};
      const errors = {};

      if (!email) {
        errors.email = ['Email is mandatory.'];
      } else if (!VALID_EMAIL_RE.test(email)) {
        errors.email = ['Email must contain @.'];
      }

      if (!password) {
        errors.password = ['Password is mandatory.'];
      } else if (password.length < 10) {
        errors.password = ['Password must be at least 10 characters.'];
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ description: 'Invalid request parameters.', errors });
      }

      const meta = {
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
      };

      const { token, user } = await AuthService.login(email, password, meta);

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role?.name ?? null,
        },
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ description: error.message });
    }
  }
}

export default AuthController;
