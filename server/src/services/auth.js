import crypto from 'node:crypto';
import Users from '../database/models/Users.js';
import Roles from '../database/models/Roles.js';
import Sessions from '../database/models/Sessions.js';
import PasswordResetTokens from '../database/models/PasswordResetTokens.js';
import { sendPasswordResetEmail } from './email.js';

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

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

  /**
   * Authenticate a user by email and password.
   * Creates a new session and returns the token alongside the user.
   * @param {string} email
   * @param {string} password
   * @param {Object} meta - ip_address and user_agent from the request.
   * @returns {Promise<{ token: string, user: User }>}
   */
  static async login(email, password, meta = {}) {
    const user = await Users.findOne({
      where: { email },
      include: [{ model: Roles, as: 'role' }],
    });

    if (!user) {
      const error = new Error('Utilizador não encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (user.password_hash !== password) {
      const error = new Error('Token inválido ou expirado');
      error.statusCode = 401;
      throw error;
    }

    const token = crypto.randomBytes(32).toString('hex');
    await Sessions.create({
      user_id: user.id,
      token,
      expires_at: new Date(Date.now() + SESSION_TTL_MS),
      ip_address: meta.ip_address ?? null,
      user_agent: meta.user_agent ?? null,
    });

    return { token, user };
  }

  /**
   * Generate a password reset token and send it by email.
   * Always resolves (never reveals whether the email exists in the DB).
   * @param {string} email
   */
  static async forgotPassword(email) {
    const user = await Users.findOne({ where: { email } });

    if (!user) return;

    const token = crypto.randomBytes(32).toString('hex');
    await PasswordResetTokens.create({
      user_id: user.id,
      token,
      expires_at: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    });

    await sendPasswordResetEmail(email, token);
  }
}

export default AuthService;
