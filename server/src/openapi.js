import env from './env.js';

const json = (schema) => ({ 'application/json': { schema } });

const ok = (description, schema) => ({
  description,
  ...(schema ? { content: json(schema) } : {}),
});

const ref = (name) => ({ $ref: `#/components/schemas/${name}` });

// Reusable responses
const ValidationError = {
  description: 'Invalid request parameters.',
  content: json(ref('ValidationError')),
};
const Unauthorized = { description: 'Missing or invalid token.', content: json(ref('Error')) };
const Forbidden = { description: 'Insufficient permissions.', content: json(ref('Error')) };
const NotFound = { description: 'Resource not found.', content: json(ref('Error')) };

const idParam = (name, description) => ({
  name,
  in: 'path',
  required: true,
  description,
  schema: { type: 'string' },
});

const queryParam = (name, schema, description) => ({
  name,
  in: 'query',
  required: false,
  description,
  schema,
});

const pageParams = [
  queryParam('page', { type: 'integer', minimum: 1, default: 1 }, 'Page number.'),
  queryParam('perPage', { type: 'integer', minimum: 1, default: 10 }, 'Items per page.'),
];

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
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          description: { type: 'string' },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          description: { type: 'string', example: 'Invalid request parameters.' },
          errors: {
            type: 'object',
            additionalProperties: { type: 'array', items: { type: 'string' } },
          },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer' },
          perPage: { type: 'integer' },
          limit: { type: 'integer' },
          total: { type: 'integer' },
          totalPages: { type: 'integer' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string', format: 'email' },
          fullName: { type: 'string' },
          role: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Space: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          city: { type: 'string' },
          postalCode: { type: 'string' },
          latitude: { type: 'number' },
          longitude: { type: 'number' },
          zonesCount: { type: 'integer' },
          sensorsCount: { type: 'integer' },
          activeAlerts: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      Zone: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      },
      Sensor: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          parameter: { type: 'string' },
          unit: { type: 'string' },
          minValue: { type: 'number' },
          maxValue: { type: 'number' },
          isActive: { type: 'boolean' },
        },
      },
      Role: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          permissionsDump: { type: 'object', additionalProperties: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Permission: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'users:read' },
          resource: { type: 'string', example: 'users' },
          action: { type: 'string', example: 'read' },
        },
      },
      Report: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          greenSpaceId: { type: 'string' },
          type: { type: 'string', enum: ['operational', 'environmental'] },
          status: { type: 'string' },
          url: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          createdBy: { type: 'string' },
        },
      },
    },
    responses: {
      ValidationError,
      Unauthorized,
      Forbidden,
      NotFound,
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'Auth' },
    { name: 'Users' },
    { name: 'Spaces' },
    { name: 'Zones' },
    { name: 'Roles' },
    { name: 'Reports' },
    { name: 'Sensors' },
    { name: 'Alerts' },
    { name: 'Maintenance' },
    { name: 'Dashboard' },
    { name: 'Health' },
  ],
  paths: {
    // ---------- Health ----------
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        security: [],
        responses: {
          200: ok('Service is healthy.', {
            type: 'object',
            properties: { status: { type: 'string', example: 'ok' } },
          }),
        },
      },
    },

    // ---------- Auth ----------
    '/users/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authenticate and obtain a JWT.',
        security: [],
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string', minLength: 10 },
            },
          }),
        },
        responses: {
          200: ok('Authenticated.', {
            type: 'object',
            properties: {
              token: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  fullName: { type: 'string' },
                  role: { type: 'string', nullable: true },
                },
              },
            },
          }),
          400: ValidationError,
          401: Unauthorized,
        },
      },
    },
    '/users/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Request a password reset email.',
        security: [],
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            required: ['email'],
            properties: { email: { type: 'string', format: 'email' } },
          }),
        },
        responses: {
          200: ok('Reset email sent (always 200).', { type: 'object', properties: { message: { type: 'string' } } }),
          400: ValidationError,
        },
      },
    },
    '/users/update-password': {
      patch: {
        tags: ['Auth'],
        summary: 'Reset password using a reset token.',
        security: [],
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            required: ['token', 'password', 'confirmPassword'],
            properties: {
              token: { type: 'string' },
              password: { type: 'string', minLength: 10 },
              confirmPassword: { type: 'string', minLength: 10 },
            },
          }),
        },
        responses: { 200: ok('Password updated.'), 400: ValidationError },
      },
    },
    '/users/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get the authenticated user.',
        responses: { 200: ok('Current user.', ref('User')), 401: Unauthorized },
      },
      patch: {
        tags: ['Auth'],
        summary: 'Update the authenticated user profile.',
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            required: ['fullName', 'email'],
            properties: {
              fullName: { type: 'string' },
              email: { type: 'string', format: 'email' },
            },
          }),
        },
        responses: { 200: ok('Updated user.', ref('User')), 400: ValidationError, 401: Unauthorized },
      },
    },
    '/users/change-password': {
      patch: {
        tags: ['Auth'],
        summary: 'Change password (verifies the current one).',
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            required: ['currentPassword', 'newPassword'],
            properties: {
              currentPassword: { type: 'string' },
              newPassword: { type: 'string', minLength: 10 },
            },
          }),
        },
        responses: { 200: ok('Password changed.'), 400: ValidationError, 401: Unauthorized },
      },
    },

    // ---------- Users ----------
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'List users (paginated, filterable).',
        description: 'Requires permission `users:read`. Pass `summary=true` to include the user statistics summary.',
        parameters: [
          ...pageParams,
          queryParam('query', { type: 'string' }, 'Search term.'),
          queryParam('role', { type: 'string' }, 'Filter by role.'),
          queryParam('status', { type: 'string' }, 'Filter by status.'),
          queryParam('summary', { type: 'boolean' }, 'Include user statistics summary when true.'),
        ],
        responses: {
          200: ok('Paginated users.', {
            type: 'object',
            properties: {
              users: { type: 'array', items: ref('User') },
              pagination: ref('Pagination'),
              summary: {
                type: 'object',
                description: 'Present only when summary=true.',
                properties: {
                  total: { type: 'integer' },
                  active: { type: 'integer' },
                  suspended: { type: 'integer' },
                  accessToday: { type: 'integer' },
                  adminCount: { type: 'integer' },
                },
              },
            },
          }),
          401: Unauthorized,
          403: Forbidden,
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Create a user.',
        description: 'Requires permission `users:create`.',
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            required: ['fullName', 'email', 'password', 'role'],
            properties: {
              fullName: { type: 'string' },
              email: { type: 'string', format: 'email' },
              password: { type: 'string', minLength: 10 },
              role: { type: 'string' },
            },
          }),
        },
        responses: { 201: ok('Created user.', ref('User')), 400: ValidationError, 401: Unauthorized, 403: Forbidden },
      },
    },
    '/users/{userId}': {
      parameters: [idParam('userId', 'User id.')],
      get: {
        tags: ['Users'],
        summary: 'Get a user by id.',
        description: 'Requires permission `users:read`.',
        responses: { 200: ok('User.', ref('User')), 401: Unauthorized, 403: Forbidden, 404: NotFound },
      },
      put: {
        tags: ['Users'],
        summary: 'Update a user.',
        description: 'Requires permission `users:update`.',
        requestBody: {
          content: json({
            type: 'object',
            properties: {
              fullName: { type: 'string' },
              email: { type: 'string', format: 'email' },
              password: { type: 'string', minLength: 10 },
              role: { type: 'string' },
            },
          }),
        },
        responses: { 200: ok('Updated user.', ref('User')), 400: ValidationError, 401: Unauthorized, 403: Forbidden, 404: NotFound },
      },
      delete: {
        tags: ['Users'],
        summary: 'Soft-delete a user.',
        description: 'Requires permission `users:delete`.',
        responses: { 204: ok('Deleted.'), 401: Unauthorized, 403: Forbidden, 404: NotFound },
      },
    },

    // ---------- Spaces ----------
    '/spaces': {
      get: {
        tags: ['Spaces'],
        summary: 'List spaces (paginated, filterable).',
        description: 'Requires permission `spaces:read`. Pass `summary=true` to include the spaces statistics summary.',
        parameters: [
          ...pageParams,
          queryParam('query', { type: 'string' }, 'Search term.'),
          queryParam('city', { type: 'string' }, 'Filter by city.'),
          queryParam('summary', { type: 'boolean' }, 'Include spaces statistics summary when true.'),
        ],
        responses: {
          200: ok('Paginated spaces.', {
            type: 'object',
            properties: {
              spaces: { type: 'array', items: ref('Space') },
              pagination: ref('Pagination'),
              summary: {
                type: 'object',
                description: 'Present only when summary=true.',
                properties: {
                  spacesCount: { type: 'integer' },
                  zonesCount: { type: 'integer' },
                  activeCount: { type: 'integer' },
                  districtsCount: { type: 'integer' },
                  cities: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          }),
          401: Unauthorized,
          403: Forbidden,
        },
      },
      post: {
        tags: ['Spaces'],
        summary: 'Create a space.',
        description: 'Requires permission `spaces:create`.',
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            required: ['name', 'city', 'postalCode', 'latitude', 'longitude'],
            properties: {
              name: { type: 'string' },
              city: { type: 'string' },
              postalCode: { type: 'string' },
              latitude: { type: 'number' },
              longitude: { type: 'number' },
            },
          }),
        },
        responses: { 201: ok('Created space.', ref('Space')), 400: ValidationError, 401: Unauthorized, 403: Forbidden },
      },
    },
    '/spaces/{spaceId}': {
      parameters: [idParam('spaceId', 'Space id.')],
      get: {
        tags: ['Spaces'],
        summary: 'Get a space by id.',
        description: 'Requires permission `spaces:read`.',
        responses: { 200: ok('Space.', ref('Space')), 401: Unauthorized, 403: Forbidden, 404: NotFound },
      },
      put: {
        tags: ['Spaces'],
        summary: 'Update a space.',
        description: 'Requires permission `spaces:update`.',
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            properties: {
              name: { type: 'string' },
              city: { type: 'string' },
              postalCode: { type: 'string' },
              latitude: { type: 'number' },
              longitude: { type: 'number' },
            },
          }),
        },
        responses: { 200: ok('Updated space.', ref('Space')), 400: ValidationError, 401: Unauthorized, 403: Forbidden, 404: NotFound },
      },
    },

    // ---------- Zones (nested under a space) ----------
    '/spaces/{spaceId}/zones': {
      parameters: [idParam('spaceId', 'Space id.')],
      get: {
        tags: ['Zones'],
        summary: 'List zones of a space.',
        responses: { 200: ok('Zones.', { type: 'array', items: ref('Zone') }), 401: Unauthorized },
      },
      post: {
        tags: ['Zones'],
        summary: 'Create a zone for a space.',
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            required: ['name'],
            properties: { name: { type: 'string' } },
          }),
        },
        responses: { 201: ok('Created zone.', ref('Zone')), 400: ValidationError, 401: Unauthorized },
      },
    },
    '/spaces/{spaceId}/zones/{zoneId}': {
      parameters: [idParam('spaceId', 'Space id.'), idParam('zoneId', 'Zone id.')],
      get: {
        tags: ['Zones'],
        summary: 'Get a zone by id.',
        responses: { 200: ok('Zone.', ref('Zone')), 401: Unauthorized, 404: NotFound },
      },
      put: {
        tags: ['Zones'],
        summary: 'Update a zone.',
        requestBody: {
          required: true,
          content: json({ type: 'object', properties: { name: { type: 'string' } } }),
        },
        responses: { 200: ok('Updated zone.', ref('Zone')), 400: ValidationError, 401: Unauthorized, 404: NotFound },
      },
      delete: {
        tags: ['Zones'],
        summary: 'Delete a zone.',
        responses: { 204: ok('Deleted.'), 401: Unauthorized, 404: NotFound },
      },
    },

    // ---------- Roles ----------
    '/roles': {
      get: {
        tags: ['Roles'],
        summary: 'List roles.',
        description: 'Requires permission `roles:read`.',
        responses: { 200: ok('Roles.', { type: 'array', items: ref('Role') }), 401: Unauthorized, 403: Forbidden },
      },
      post: {
        tags: ['Roles'],
        summary: 'Create a role.',
        description: 'Requires permission `roles:create`.',
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            required: ['name', 'description'],
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              permissions: { type: 'array', items: { type: 'string' } },
            },
          }),
        },
        responses: { 200: ok('Created role.', ref('Role')), 400: ValidationError, 401: Unauthorized, 403: Forbidden },
      },
    },
    '/roles/permissions/catalog': {
      get: {
        tags: ['Roles'],
        summary: 'List all known permissions.',
        description: 'Requires permission `roles:read`.',
        responses: { 200: ok('Permissions catalog.', { type: 'array', items: ref('Permission') }), 401: Unauthorized, 403: Forbidden },
      },
    },
    '/roles/{roleId}/permissions': {
      parameters: [idParam('roleId', 'Role id.')],
      patch: {
        tags: ['Roles'],
        summary: 'Toggle a permission for a role.',
        description: 'Requires permission `roles:update`.',
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            required: ['permissionId'],
            properties: { permissionId: { type: 'string' } },
          }),
        },
        responses: {
          200: ok('Updated.', { type: 'object', properties: { permissionId: { type: 'string' } } }),
          400: ValidationError,
          401: Unauthorized,
          403: Forbidden,
        },
      },
    },

    // ---------- Reports ----------
    '/reports': {
      get: {
        tags: ['Reports'],
        summary: 'List reports (paginated).',
        description: 'Requires permission `reports:read`.',
        parameters: [
          queryParam('page', { type: 'integer', minimum: 1, default: 1 }, 'Page number.'),
          queryParam('limit', { type: 'integer', minimum: 1, default: 20 }, 'Items per page.'),
        ],
        responses: {
          200: ok('Paginated reports.', {
            type: 'object',
            properties: {
              reports: { type: 'array', items: ref('Report') },
              pagination: ref('Pagination'),
            },
          }),
          401: Unauthorized,
          403: Forbidden,
        },
      },
    },
    '/reports/summary': {
      get: {
        tags: ['Reports'],
        summary: 'Reports statistics summary.',
        description: 'Requires permission `reports:read`.',
        responses: { 200: ok('Summary.', { type: 'object' }), 401: Unauthorized, 403: Forbidden },
      },
    },
    '/reports/distribution': {
      get: {
        tags: ['Reports'],
        summary: 'Reports distribution by type.',
        description: 'Requires permission `reports:read`.',
        responses: { 200: ok('Distribution.', { type: 'object' }), 401: Unauthorized, 403: Forbidden },
      },
    },
    '/reports/generate': {
      post: {
        tags: ['Reports'],
        summary: 'Generate a report.',
        description: 'Requires permission `reports:create`.',
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            required: ['type', 'greenSpaceId'],
            properties: {
              type: { type: 'string', enum: ['operational', 'environmental'] },
              greenSpaceId: { type: 'string' },
            },
          }),
        },
        responses: { 200: ok('Generated report.', ref('Report')), 400: ValidationError, 401: Unauthorized, 403: Forbidden },
      },
    },
    '/reports/{reportId}/export': {
      parameters: [idParam('reportId', 'Report id.')],
      get: {
        tags: ['Reports'],
        summary: 'Export a report (returns download metadata).',
        description: 'Requires permission `reports:read`.',
        responses: { 200: ok('Export metadata.', ref('Report')), 401: Unauthorized, 403: Forbidden, 404: NotFound },
      },
    },
    '/reports/{spaceId}/incident': {
      parameters: [idParam('spaceId', 'Space id.')],
      post: {
        tags: ['Reports'],
        summary: 'Create an incident for a space.',
        security: [],
        requestBody: { required: true, content: json({ type: 'object' }) },
        responses: { 201: ok('Created incident.', { type: 'object' }) },
      },
    },
    '/reports/{spaceId}/comment': {
      parameters: [idParam('spaceId', 'Space id.')],
      post: {
        tags: ['Reports'],
        summary: 'Create a comment for a space.',
        security: [],
        requestBody: { required: true, content: json({ type: 'object' }) },
        responses: { 201: ok('Created comment.', { type: 'object' }) },
      },
    },

    // ---------- Sensors ----------
    '/sensors': {
      get: {
        tags: ['Sensors'],
        summary: 'List sensors (paginated).',
        security: [],
        parameters: [
          queryParam('page', { type: 'integer', minimum: 1, default: 1 }, 'Page number.'),
          queryParam('limit', { type: 'integer', minimum: 1, default: 20 }, 'Items per page.'),
          queryParam('sort', { type: 'string' }, 'Sort expression.'),
        ],
        responses: {
          200: ok('Paginated sensors.', {
            type: 'object',
            properties: {
              sensors: { type: 'array', items: ref('Sensor') },
              pagination: ref('Pagination'),
            },
          }),
        },
      },
      post: {
        tags: ['Sensors'],
        summary: 'Create a sensor (use the space-nested route).',
        responses: { 201: ok('Created sensor.', ref('Sensor')), 400: ValidationError, 401: Unauthorized },
      },
    },
    '/sensors/summary': {
      get: {
        tags: ['Sensors'],
        summary: 'Sensors statistics summary.',
        security: [],
        responses: { 200: ok('Summary.', { type: 'object' }) },
      },
    },
    '/sensors/distribution': {
      get: {
        tags: ['Sensors'],
        summary: 'Sensors distribution by status.',
        security: [],
        responses: { 200: ok('Distribution.', { type: 'object' }) },
      },
    },
    '/sensors/{sensorId}': {
      parameters: [idParam('sensorId', 'Sensor id.')],
      put: {
        tags: ['Sensors'],
        summary: 'Update a sensor (not implemented).',
        responses: { 501: ok('Not implemented.', ref('Error')), 401: Unauthorized },
      },
      delete: {
        tags: ['Sensors'],
        summary: 'Delete a sensor (not implemented).',
        responses: { 501: ok('Not implemented.', ref('Error')), 401: Unauthorized },
      },
    },
    '/spaces/{spaceId}/sensors': {
      parameters: [idParam('spaceId', 'Space id.')],
      get: {
        tags: ['Sensors'],
        summary: 'List sensors of a space.',
        security: [],
        responses: { 200: ok('Sensors.', { type: 'array', items: ref('Sensor') }) },
      },
      post: {
        tags: ['Sensors'],
        summary: 'Register a sensor for a space.',
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            required: ['zoneId', 'type'],
            properties: {
              zoneId: { type: 'string' },
              type: { type: 'string' },
              parameter: { type: 'string' },
              unit: { type: 'string' },
              minValue: { type: 'number' },
              maxValue: { type: 'number' },
              isActive: { type: 'boolean' },
            },
          }),
        },
        responses: { 201: ok('Created sensor.', ref('Sensor')), 400: ValidationError, 401: Unauthorized },
      },
    },

    // ---------- Alerts ----------
    '/alerts': {
      get: {
        tags: ['Alerts'],
        summary: 'List alerts.',
        responses: { 200: ok('Alerts.', { type: 'array', items: { type: 'object' } }), 401: Unauthorized },
      },
    },
    '/alerts/summary': {
      get: {
        tags: ['Alerts'],
        summary: 'Alerts statistics summary.',
        security: [],
        responses: { 200: ok('Summary.', { type: 'object' }) },
      },
    },
    '/alerts/{alertId}/acknowledge': {
      parameters: [idParam('alertId', 'Alert id.')],
      patch: {
        tags: ['Alerts'],
        summary: 'Acknowledge an alert.',
        security: [],
        responses: { 200: ok('Acknowledged.', { type: 'object' }), 404: NotFound },
      },
    },
    '/alerts/{incidentId}': {
      parameters: [idParam('incidentId', 'Incident/alert id.')],
      patch: {
        tags: ['Alerts'],
        summary: 'Update an alert.',
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            properties: {
              severity: { type: 'string' },
              message: { type: 'string' },
              is_notified: { type: 'boolean' },
            },
          }),
        },
        responses: { 200: ok('Updated alert.', { type: 'object' }), 400: ValidationError, 401: Unauthorized, 404: NotFound },
      },
    },

    // ---------- Maintenance ----------
    '/maintenance': {
      get: {
        tags: ['Maintenance'],
        summary: 'List maintenance tasks (paginated).',
        parameters: [
          queryParam('page', { type: 'integer', minimum: 1, default: 1 }, 'Page number.'),
          queryParam('limit', { type: 'integer', minimum: 1, default: 20 }, 'Items per page.'),
        ],
        responses: {
          200: ok('Paginated tasks.', {
            type: 'object',
            properties: {
              tasks: { type: 'array', items: { type: 'object' } },
              pagination: ref('Pagination'),
            },
          }),
          401: Unauthorized,
        },
      },
      post: {
        tags: ['Maintenance'],
        summary: 'Create a maintenance task.',
        requestBody: { required: true, content: json({ type: 'object' }) },
        responses: { 201: ok('Created task.', { type: 'object' }), 400: ValidationError, 401: Unauthorized },
      },
    },
    '/maintenance/summary': {
      get: {
        tags: ['Maintenance'],
        summary: 'Maintenance statistics summary.',
        security: [],
        responses: { 200: ok('Summary.', { type: 'object' }) },
      },
    },
    '/maintenance/{maintenanceId}': {
      parameters: [idParam('maintenanceId', 'Maintenance task id.')],
      delete: {
        tags: ['Maintenance'],
        summary: 'Delete a maintenance task.',
        responses: { 204: ok('Deleted.'), 401: Unauthorized, 404: NotFound },
      },
    },

    // ---------- Dashboard ----------
    '/dashboard/summary': {
      get: {
        tags: ['Dashboard'],
        summary: 'Dashboard summary.',
        security: [],
        responses: { 200: ok('Summary.', { type: 'object' }) },
      },
    },
    '/dashboard/citizen-incidents': {
      get: {
        tags: ['Dashboard'],
        summary: 'Citizen incidents (paginated).',
        security: [],
        parameters: [
          queryParam('page', { type: 'integer', minimum: 1, default: 1 }, 'Page number.'),
          queryParam('limit', { type: 'integer', minimum: 1, default: 20 }, 'Items per page.'),
          queryParam('sort', { type: 'string' }, 'Sort expression.'),
        ],
        responses: { 200: ok('Citizen incidents.', { type: 'object' }) },
      },
    },
    '/dashboard/irrigation-lighting': {
      get: {
        tags: ['Dashboard'],
        summary: 'Irrigation and lighting status by space.',
        security: [],
        responses: { 200: ok('Irrigation/lighting.', { type: 'object' }) },
      },
    },
  },
};
