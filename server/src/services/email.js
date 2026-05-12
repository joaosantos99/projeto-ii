import nodemailer from 'nodemailer';
import env from '../env.js';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

/**
 * Send a password reset email with a link containing the reset token.
 * @param {string} to - Recipient email address.
 * @param {string} resetToken - The password reset token.
 */
export async function sendPasswordResetEmail(to, resetToken) {
  const resetUrl = `${env.FRONTEND_URL}/redefinir-password?token=${resetToken}`;

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: 'Recuperação de palavra-passe',
    html: `
      <p>Recebemos um pedido para redefinir a sua palavra-passe.</p>
      <p>Clique no link abaixo para criar uma nova palavra-passe. O link expira em 1 hora.</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>Se não solicitou esta alteração, pode ignorar este email.</p>
    `,
  });
}
