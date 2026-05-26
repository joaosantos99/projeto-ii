import env from './env.js';

export default {
  openapi: '3.0.3',
  info: {
    title: 'Projeto II API',
    version: '1.0.0',
    description: 'REST API for the Projeto II server.',
  },
  servers: [
    { url: `http://localhost:${env.PORT}/api`, description: 'Local' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'Auth' },
    { name: 'Users' },
    { name: 'Spaces' },
    { name: 'Roles' },
    { name: 'Reports' },
    { name: 'Sensors' },
    { name: 'Alerts' },
    { name: 'Maintenance' },
    { name: 'Dashboard' },
    { name: 'Health' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        security: [],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { status: { type: 'string', example: 'ok' } },
                },
              },
            },
          },
        },
      },
    },
  },
};
