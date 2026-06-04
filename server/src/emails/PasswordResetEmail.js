import * as React from 'react';
import { Html, Head, Body, Container, Text, Button, Link } from '@react-email/components';

const h = React.createElement;

export function PasswordResetEmail({ resetUrl }) {
  return h(
    Html,
    null,
    h(Head),
    h(
      Body,
      { style: { fontFamily: 'system-ui, sans-serif', backgroundColor: '#f5f5f5', padding: '20px' } },
      h(
        Container,
        { style: { backgroundColor: '#ffffff', padding: '32px', borderRadius: '8px', maxWidth: '480px' } },
        h(
          Text,
          { style: { fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' } },
          'Recuperação de palavra-passe'
        ),
        h(
          Text,
          { style: { fontSize: '14px', color: '#4b5563', lineHeight: '1.6', marginBottom: '24px' } },
          'Recebemos um pedido para redefinir a sua palavra-passe. Clique no botão abaixo para criar uma nova palavra-passe. O link expira em 1 hora.'
        ),
        h(
          Button,
          {
            href: resetUrl,
            style: {
              backgroundColor: '#059669',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: '24px',
            },
          },
          'Redefinir palavra-passe'
        ),
        h(
          Text,
          { style: { fontSize: '12px', color: '#6b7280', lineHeight: '1.5' } },
          'Se o botão não funcionar, copie e cole este link no seu navegador: ',
          h(
            Link,
            { href: resetUrl, style: { color: '#059669', textDecoration: 'underline' } },
            resetUrl
          )
        ),
        h(
          Text,
          { style: { fontSize: '12px', color: '#6b7280', marginTop: '16px' } },
          'Se não solicitou esta alteração, pode ignorar este email.'
        )
      )
    )
  );
}

export default PasswordResetEmail;
