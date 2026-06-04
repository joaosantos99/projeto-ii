import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
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
   * Update the authenticated user's profile (full name and email).
   * @param {string} userId - The authenticated user's id.
   * @param {Object} data - { fullName, email }.
   * @returns {Promise<User>} - The updated user with role eager-loaded.
   */
  static async updateProfile(userId, { fullName, email }) {
    const user = await Users.findByPk(userId);

    if (!user) {
      const error = new Error('Utilizador não encontrado');
      error.statusCode = 404;
      throw error;
    }

    const existing = await Users.findOne({ where: { email } });
    if (existing && existing.id !== userId) {
      const error = new Error('Email já está em uso');
      error.statusCode = 409;
      throw error;
    }

    await user.update({ full_name: fullName, email });

    return this.getMe(userId);
  }

  /**
   * Change the authenticated user's password after verifying the current one.
   * @param {string} userId - The authenticated user's id.
   * @param {string} currentPassword - The current plain-text password.
   * @param {string} newPassword - The new plain-text password.
   */
  static async changePassword(userId, currentPassword, newPassword) {
    const user = await Users.findByPk(userId);

    if (!user) {
      const error = new Error('Utilizador não encontrado');
      error.statusCode = 404;
      throw error;
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!passwordMatch) {
      const error = new Error('Palavra-passe atual incorreta');
      error.statusCode = 401;
      throw error;
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await user.update({ password_hash: hashed });
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

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      const error = new Error('Token inválido ou expirado');
      error.statusCode = 401;
      throw error;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    await Sessions.create({
      user_id: user.id,
      token,
      expires_at: expiresAt,
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

    if (!user) {
      console.log(`Password reset requested for unknown email: ${email}`);
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    await PasswordResetTokens.create({
      user_id: user.id,
      token,
      expires_at: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    });

    console.log(`Sending password reset email to: ${email}`);
    await sendPasswordResetEmail(email, token);
    console.log(`Password reset email sent successfully to: ${email}`);
  }

  /**
   * Reset a user's password using a valid reset token.
   * Marks the token as used after a successful update.
   * @param {string} resetToken - The token from the reset email link.
   * @param {string} newPassword - The new plain-text password.
   */
  static async updatePassword(resetToken, newPassword) {
    const record = await PasswordResetTokens.findOne({
      where: { token: resetToken },
    });

    if (!record || record.used_at !== null) {
      const error = new Error('Token inválido ou expirado');
      error.statusCode = 401;
      throw error;
    }

    if (new Date(record.expires_at).getTime() <= Date.now()) {
      const error = new Error('Token inválido ou expirado');
      error.statusCode = 401;
      throw error;
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await Users.update(
      { password_hash: hashed },
      { where: { id: record.user_id } },
    );

    await record.update({ used_at: new Date() });
  }
}

export default AuthService;
