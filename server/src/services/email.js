import * as React from 'react';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import env from '../env.js';
import { PasswordResetEmail } from '../emails/PasswordResetEmail.js';

const resend = new Resend(env.RESEND_API_KEY);

/**
 * Send a password reset email with a link containing the reset token.
 * @param {string} to - Recipient email address.
 * @param {string} resetToken - The password reset token.
 */
export async function sendPasswordResetEmail(to, resetToken) {
  const resetUrl = `${env.FRONTEND_URL}/redefinir-password?token=${resetToken}`;
  const html = await render(React.createElement(PasswordResetEmail, { resetUrl }));

  await resend.emails.send({
    from: env.RESEND_FROM,
    to,
    subject: 'Recuperação de palavra-passe',
    html,
  });
}
