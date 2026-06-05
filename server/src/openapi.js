import env from './env.js';

const json = (schema) => ({ 'application/json': { schema } });

const ok = (description, schema) => ({
  description,
  ...(schema ? { content: json(schema) } : {}),
});

const ref = (name) => ({ $ref: `#/components/schemas/${name}` });

// Single-resource responses are wrapped as `{ data, _links }`.
const linksSelf = {
  type: 'object',
  properties: {
    self: { type: 'object', properties: { href: { type: 'string' } } },
  },
};
const withLinks = (schema) => ({
  type: 'object',
  properties: { data: schema, _links: linksSelf },
});

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
          parish: { type: 'string' },
          postalCode: { type: 'string' },
          imageUrl: { type: 'string', nullable: true },
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
      MaintenanceTask: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          green_spaces_id: { type: 'string', nullable: true },
          type: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['scheduled', 'in_progress', 'critical', 'completed'] },
          scheduled_date: { type: 'string', format: 'date-time', nullable: true },
          completed_at: { type: 'string', format: 'date-time', nullable: true },
          created_by: { type: 'string', nullable: true },
          updated_by: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
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
        description: 'Requires permission `spaces:read`. Pass `summary=true` to include the spaces statistics summary. Pass `sensoresStatus=true` to include, per space, the latest-reading status of each sensor type.',
        parameters: [
          ...pageParams,
          queryParam('query', { type: 'string' }, 'Search term.'),
          queryParam('parish', { type: 'string' }, 'Filter by parish.'),
          queryParam('summary', { type: 'boolean' }, 'Include spaces statistics summary when true.'),
          queryParam('sensoresStatus', { type: 'boolean' }, 'Include per-type sensor status (from the latest reading) on each space when true.'),
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
                  parishCount: { type: 'integer' },
                  parishes: { type: 'array', items: { type: 'string' } },
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
        description: 'Requires permission `spaces:create`. Send as `multipart/form-data` to attach an optional `image` (JPEG, PNG, WebP or AVIF, max 5 MB); JSON is also accepted when no image is uploaded.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'parish', 'postalCode', 'latitude', 'longitude'],
                properties: {
                  name: { type: 'string' },
                  parish: { type: 'string' },
                  postalCode: { type: 'string' },
                  latitude: { type: 'number' },
                  longitude: { type: 'number' },
                },
              },
            },
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['name', 'parish', 'postalCode', 'latitude', 'longitude'],
                properties: {
                  name: { type: 'string' },
                  parish: { type: 'string' },
                  postalCode: { type: 'string' },
                  latitude: { type: 'number' },
                  longitude: { type: 'number' },
                  image: { type: 'string', format: 'binary' },
                },
              },
            },
          },
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
              parish: { type: 'string' },
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
          queryParam('offlineOnly', { type: 'boolean' }, 'When true, return only offline (inactive) sensors. Read `meta.total` for the count.'),
          queryParam('status', { type: 'string', enum: ['online', 'offline'] }, 'Filter by operational status.'),
          queryParam('type', { type: 'string' }, 'Filter by sensor type.'),
          queryParam('query', { type: 'string' }, 'Search by parameter, type, zone or space name.'),
          queryParam('summary', { type: 'boolean' }, 'When true, embed the global sensor statistics summary (independent of page and filters).'),
          queryParam('distribution', { type: 'boolean' }, 'When true, embed the global sensor distribution by status (independent of page and filters).'),
        ],
        responses: {
          200: ok('Paginated sensors.', {
            type: 'object',
            properties: {
              data: { type: 'array', items: ref('Sensor') },
              meta: ref('Pagination'),
              summary: { type: 'object' },
              distribution: { type: 'object' },
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
    '/sensors/{sensorId}': {
      parameters: [idParam('sensorId', 'Sensor id.')],
      put: {
        tags: ['Sensors'],
        summary: 'Update a sensor.',
        requestBody: {
          required: true,
          content: json({
            type: 'object',
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
        responses: { 200: ok('Updated sensor.', ref('Sensor')), 400: ValidationError, 401: Unauthorized, 404: NotFound },
      },
      delete: {
        tags: ['Sensors'],
        summary: 'Delete a sensor.',
        responses: { 204: ok('Deleted.'), 401: Unauthorized, 404: NotFound },
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
        summary: 'List alerts (paginated).',
        parameters: [
          queryParam('page', { type: 'integer', minimum: 1, default: 1 }, 'Page number.'),
          queryParam('limit', { type: 'integer', minimum: 1, default: 20 }, 'Items per page.'),
          queryParam('severity', { type: 'string' }, 'Filter by severity.'),
          queryParam('onlyCount', { type: 'boolean' }, 'When true, skip rows and return only `{ meta: { total } }`.'),
          queryParam('summary', { type: 'boolean' }, 'When true, include the alerts statistics summary under `summary`.'),
        ],
        responses: {
          200: ok('Paginated alerts.', {
            type: 'object',
            properties: {
              data: { type: 'array', items: { type: 'object' } },
              meta: ref('Pagination'),
            },
          }),
          401: Unauthorized,
        },
      },
    },
    '/alerts/{alertId}': {
      parameters: [idParam('alertId', 'Alert id.')],
      patch: {
        tags: ['Alerts'],
        summary: 'Update an alert. Pass `acknowledged: true` to acknowledge it.',
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            properties: {
              severity: { type: 'string' },
              message: { type: 'string' },
              is_notified: { type: 'boolean' },
              acknowledged: { type: 'boolean' },
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
        description: 'Pass `summary=true` to include the maintenance statistics summary.',
        parameters: [
          queryParam('page', { type: 'integer', minimum: 1, default: 1 }, 'Page number.'),
          queryParam('limit', { type: 'integer', minimum: 1, default: 20 }, 'Items per page.'),
          queryParam('summary', { type: 'boolean' }, 'Include maintenance statistics summary when true.'),
          queryParam('status', { type: 'string' }, 'Filter by status. The synthetic value `atraso` returns overdue, not-yet-completed tasks. Read `meta.total` for the count.'),
          queryParam('includeAverageResponseTime', { type: 'boolean' }, 'When true, include `meta.averageResponseTime` (minutes) across completed tasks.'),
        ],
        responses: {
          200: ok('Paginated tasks.', {
            type: 'object',
            properties: {
              data: { type: 'array', items: ref('MaintenanceTask') },
              meta: ref('Pagination'),
              _links: linksSelf,
              summary: {
                type: 'object',
                description: 'Present only when summary=true.',
                properties: {
                  totalActiveRules: { type: 'integer' },
                  totalInProgressTasks: { type: 'integer' },
                  totalCriticalTasks: { type: 'integer' },
                  totalLateTasks: { type: 'integer' },
                },
              },
            },
          }),
          401: Unauthorized,
        },
      },
      post: {
        tags: ['Maintenance'],
        summary: 'Create a maintenance task.',
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            required: ['type', 'description'],
            properties: {
              type: { type: 'string' },
              description: { type: 'string' },
              status: { type: 'string', enum: ['scheduled', 'in_progress', 'critical', 'completed'], default: 'scheduled' },
              green_spaces_id: { type: 'string' },
              scheduled_date: { type: 'string', format: 'date-time' },
            },
          }),
        },
        responses: { 201: ok('Created task.', withLinks(ref('MaintenanceTask'))), 400: ValidationError, 401: Unauthorized },
      },
    },
    '/maintenance/{maintenanceId}': {
      parameters: [idParam('maintenanceId', 'Maintenance task id.')],
      get: {
        tags: ['Maintenance'],
        summary: 'Get a maintenance task by id.',
        responses: { 200: ok('Task.', withLinks(ref('MaintenanceTask'))), 401: Unauthorized, 404: NotFound },
      },
      put: {
        tags: ['Maintenance'],
        summary: 'Full replacement of a maintenance task.',
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            required: ['type', 'description'],
            properties: {
              type: { type: 'string' },
              description: { type: 'string' },
              status: { type: 'string', enum: ['scheduled', 'in_progress', 'critical', 'completed'] },
              green_spaces_id: { type: 'string' },
              scheduled_date: { type: 'string', format: 'date-time' },
              completed_at: { type: 'string', format: 'date-time', nullable: true },
            },
          }),
        },
        responses: { 200: ok('Updated task.', withLinks(ref('MaintenanceTask'))), 400: ValidationError, 401: Unauthorized, 404: NotFound },
      },
      patch: {
        tags: ['Maintenance'],
        summary: 'Partial update of a maintenance task.',
        description: 'Update any subset of fields. Setting `status` to `completed` stamps `completed_at` automatically.',
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            properties: {
              type: { type: 'string' },
              description: { type: 'string' },
              status: { type: 'string', enum: ['scheduled', 'in_progress', 'critical', 'completed'] },
              green_spaces_id: { type: 'string' },
              scheduled_date: { type: 'string', format: 'date-time' },
              completed_at: { type: 'string', format: 'date-time', nullable: true },
            },
          }),
        },
        responses: { 200: ok('Updated task.', withLinks(ref('MaintenanceTask'))), 400: ValidationError, 401: Unauthorized, 404: NotFound },
      },
      delete: {
        tags: ['Maintenance'],
        summary: 'Delete a maintenance task.',
        responses: { 204: ok('Deleted.'), 401: Unauthorized, 404: NotFound },
      },
    },
  },
};
