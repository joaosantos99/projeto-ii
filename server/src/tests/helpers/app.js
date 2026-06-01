import http from 'node:http';
import express, { Router } from 'express';

export async function buildApp() {
  const { default: authRouter } = await import('../../routers/auth.js');
  const { default: usersRouter } = await import('../../routers/users.js');
  const { default: rolesRouter } = await import('../../routers/roles.js');

  const app = express();
  app.use(express.json());

  const apiRouter = Router();
  app.use('/api', apiRouter);

  apiRouter.use('/auth', authRouter);
  apiRouter.use('/users', usersRouter);
  apiRouter.use('/roles', rolesRouter);

  return app;
}

export function listen(app) {
  return new Promise((resolve) => {
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

export function close(server) {
  return new Promise((resolve) => server.close(resolve));
}

export function apiGet(baseUrl, path, token) {
  return fetch(`${baseUrl}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function apiPatch(baseUrl, path, token, body) {
  return fetch(`${baseUrl}${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body ?? {}),
  });
}
