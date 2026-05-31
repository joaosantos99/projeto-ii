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
   * Update the authenticated user's profile.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async updateMe(req, res) {
    try {
      const { fullName, email } = req.body ?? {};
      const errors = {};

      if (!fullName || !fullName.trim()) {
        errors.fullName = ['Full name is mandatory.'];
      }

      if (!email) {
        errors.email = ['Email is mandatory.'];
      } else if (!VALID_EMAIL_RE.test(email)) {
        errors.email = ['Email must contain @.'];
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ description: 'Invalid request parameters.', errors });
      }

      const user = await AuthService.updateProfile(req.user.id, {
        fullName: fullName.trim(),
        email,
      });
      const roles = user.role ? [user.role] : [];

      res.json(UserSerializer.serialize(user, { roles }));
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ description: error.message });
    }
  }

  /**
   * Change the authenticated user's password (verifies the current one).
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body ?? {};
      const errors = {};

      if (!currentPassword) {
        errors.currentPassword = ['Current password is mandatory.'];
      }

      if (!newPassword) {
        errors.newPassword = ['New password is mandatory.'];
      } else if (newPassword.length < 10) {
        errors.newPassword = ['Password must be at least 10 characters.'];
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ description: 'Invalid request parameters.', errors });
      }

      await AuthService.changePassword(req.user.id, currentPassword, newPassword);

      res.json({ message: 'Palavra-passe alterada com sucesso.' });
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

  /**
   * Send a password reset email to the given address if it belongs to a known user.
   * Always returns 200 to avoid revealing whether the email exists.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body ?? {};
      const errors = {};

      if (!email) {
        errors.email = ['Email is mandatory.'];
      } else if (!VALID_EMAIL_RE.test(email)) {
        errors.email = ['Email must contain @.'];
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ description: 'Invalid request parameters.', errors });
      }

      await AuthService.forgotPassword(email);

      res.json({ message: 'Email de recuperação enviado com sucesso.' });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ description: error.message });
    }
  }

  /**
   * Reset a user's password using a valid reset token.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async updatePassword(req, res) {
    try {
      const { token, password, confirmPassword } = req.body ?? {};
      const errors = {};

      if (!token) {
        errors.token = ['Token is mandatory.'];
      }

      if (!password) {
        errors.password = ['Password is mandatory.'];
      } else if (password.length < 10) {
        errors.password = ['Password must be at least 10 characters.'];
      }

      if (!confirmPassword) {
        errors.confirmPassword = ['Password confirmation is mandatory.'];
      } else if (password && password !== confirmPassword) {
        errors.confirmPassword = ['Passwords do not match.'];
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ description: 'Invalid request parameters.', errors });
      }

      await AuthService.updatePassword(token, password);

      res.json({ message: 'Password atualizada com sucesso.' });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ description: error.message });
    }
  }
}

export default AuthController;
