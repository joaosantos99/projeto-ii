import * as React from 'react';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import env from '../env.js';
import { PasswordResetEmail } from '../emails/PasswordResetEmail.js';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

// Log on module load to verify env is correct
console.log('[email] RESEND_API_KEY present:', !!env.RESEND_API_KEY);
console.log('[email] RESEND_FROM:', env.RESEND_FROM);

/**
 * Send a password reset email with a link containing the reset token.
 * @param {string} to - Recipient email address.
 * @param {string} resetToken - The password reset token.
 */
export async function sendPasswordResetEmail(to, resetToken) {
  if (!resend) {
    console.error('[email] RESEND_API_KEY not configured');
    throw new Error('Email service not configured');
  }

  const resetUrl = `${env.FRONTEND_URL}/admin/redefinir-password?token=${resetToken}`;
  console.log('Rendering email template for:', to);
  const html = await render(React.createElement(PasswordResetEmail, { resetUrl }));
  console.log('Email template rendered, sending via Resend...');

  try {
    const result = await resend.emails.send({
      from: env.RESEND_FROM,
      to,
      subject: 'Recuperação de palavra-passe',
      html,
    });

    if (result.error) {
      console.error('Resend send error:', result.error);
      throw new Error(`Failed to send email: ${result.error.message}`);
    }

    console.log('Email sent successfully, ID:', result.data?.id);
    return result;
  } catch (error) {
    console.error('Email send failed:', error.message);
    throw error;
  }
}
