import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { PERMISSIONS } from '../../constants/permissions.js';
import { startTestDatabase } from '../helpers/db.js';
import { apiGet, apiPatch, apiPost, buildApp, close, listen } from '../helpers/app.js';
import { createActor, createRole, createSession, createUser } from '../helpers/factories.js';

describe('Role management and effective permissions', () => {
  let db;
  let models;
  let server;
  let baseUrl;
  let actorId;
  let adminToken;

  beforeAll(async () => {
    db = await startTestDatabase();
    models = db.models;

    const app = await buildApp();
    ({ server, baseUrl } = await listen(app));

    // Actor satisfies the self-referencing created_by/updated_by FKs.
    actorId = await createActor(models);

    // Admin can manage roles; used to drive the management endpoints over HTTP.
    const adminRole = await createRole(models, {
      name: 'admin',
      permissions: ['roles:read', 'roles:create', 'roles:update', 'users:read'],
      actorId,
    });
    const admin = await createUser(models, { roleId: adminRole.id, actorId });
    adminToken = await createSession(models, { userId: admin.id });
  }, 120_000);

  afterAll(async () => {
    if (server) await close(server);
    if (db) await db.stop();
  });

  it('returns the full permissions catalog with id/resource/action shape', async () => {
    // GIVEN - the set of known application permissions
    const expected = Object.values(PERMISSIONS);

    // WHEN - the catalog endpoint is fetched
    const res = await apiGet(baseUrl, '/api/roles/permissions/catalog', adminToken);
    expect(res.status).toBe(200);
    const catalog = await res.json();

    // THEN - every known permission is present, split into resource/action
    expect(catalog).toHaveLength(expected.length);
    expect(catalog.map((p) => p.id).sort()).toEqual([...expected].sort());

    // AND - each entry derives resource and action from its id
    for (const entry of catalog) {
      const [resource, action] = entry.id.split(':');
      expect(entry).toEqual({ id: entry.id, resource, action });
    }
  });

  it('creates a role and grants exactly its permissions as effective permissions', async () => {
    // GIVEN - a role creation payload granting only users:read
    const payload = { name: 'Leitor', description: 'Só leitura de utilizadores', permissions: ['users:read'] };

    // WHEN - an admin creates the role
    const res = await apiPost(baseUrl, '/api/roles', adminToken, payload);
    expect(res.status).toBe(200);
    const created = await res.json();
    expect(created.name).toBe('Leitor');
    expect(created.permissionsDump).toEqual(['users:read']);

    // AND - a user is assigned to that new role
    const user = await createUser(models, { roleId: created.id, actorId });
    const token = await createSession(models, { userId: user.id });

    // THEN - the user can reach the granted resource (users:read)
    const allowed = await apiGet(baseUrl, '/api/users', token);
    expect(allowed.status).toBe(200);

    // AND - is blocked from a resource the role does not grant (roles:read)
    const denied = await apiGet(baseUrl, '/api/roles', token);
    expect(denied.status).toBe(403);
  });

  it('creates a role with no permissions and grants no effective access', async () => {
    // GIVEN - a role creation payload with an empty permission set
    const res = await apiPost(baseUrl, '/api/roles', adminToken, {
      name: 'Sem Permissões',
      description: 'Perfil vazio',
      permissions: [],
    });
    expect(res.status).toBe(200);
    const created = await res.json();
    expect(created.permissionsDump).toEqual([]);

    // WHEN - a user on that role tries protected resources
    const user = await createUser(models, { roleId: created.id, actorId });
    const token = await createSession(models, { userId: user.id });

    // THEN - every protected resource is denied
    expect((await apiGet(baseUrl, '/api/users', token)).status).toBe(403);
    expect((await apiGet(baseUrl, '/api/roles', token)).status).toBe(403);
  });

  it('lists created roles via GET /api/roles', async () => {
    // GIVEN - a uniquely named role created through the API
    const name = `Listável-${Date.now()}`;
    const created = await (await apiPost(baseUrl, '/api/roles', adminToken, {
      name,
      description: 'Aparece na listagem',
      permissions: ['spaces:read'],
    })).json();

    // WHEN - the roles list is fetched
    const res = await apiGet(baseUrl, '/api/roles', adminToken);
    expect(res.status).toBe(200);
    const roles = await res.json();

    // THEN - the created role is present with its permissions
    const found = roles.find((r) => r.id === created.id);
    expect(found).toBeDefined();
    expect(found.name).toBe(name);
    expect(found.permissionsDump).toEqual(['spaces:read']);
  });

  it('rejects creating a role with a duplicate name (409)', async () => {
    // GIVEN - an existing role name
    const name = `Duplicado-${Date.now()}`;
    const first = await apiPost(baseUrl, '/api/roles', adminToken, {
      name,
      description: 'Primeiro',
      permissions: [],
    });
    expect(first.status).toBe(200);

    // WHEN - another role is created with the same name
    const second = await apiPost(baseUrl, '/api/roles', adminToken, {
      name,
      description: 'Segundo',
      permissions: [],
    });

    // THEN - the request is rejected as a conflict
    expect(second.status).toBe(409);
  });

  it('rejects role creation with missing name or description (400)', async () => {
    // GIVEN - payloads missing a mandatory field
    // WHEN/THEN - missing description is rejected
    const noDescription = await apiPost(baseUrl, '/api/roles', adminToken, { name: 'X', permissions: [] });
    expect(noDescription.status).toBe(400);

    // AND - missing name is rejected
    const noName = await apiPost(baseUrl, '/api/roles', adminToken, { description: 'Y', permissions: [] });
    expect(noName.status).toBe(400);
  });

  it('reflects a permission toggle (add then remove) in effective permissions', async () => {
    // GIVEN - a role with no permissions and a user carrying it
    const created = await (await apiPost(baseUrl, '/api/roles', adminToken, {
      name: `Alternável-${Date.now()}`,
      description: 'Toggle',
      permissions: [],
    })).json();
    const user = await createUser(models, { roleId: created.id, actorId });
    const token = await createSession(models, { userId: user.id });

    expect((await apiGet(baseUrl, '/api/users', token)).status).toBe(403);

    // WHEN - users:read is toggled on
    const add = await apiPatch(baseUrl, `/api/roles/${created.id}/permissions`, adminToken, {
      permissionId: 'users:read',
    });
    expect(add.status).toBe(200);

    // THEN - the role now grants effective access
    expect((await apiGet(baseUrl, '/api/users', token)).status).toBe(200);

    // AND - the persisted role reflects the added permission
    const afterAdd = await (await apiGet(baseUrl, '/api/roles', adminToken)).json();
    expect(afterAdd.find((r) => r.id === created.id).permissionsDump).toEqual(['users:read']);

    // WHEN - users:read is toggled off again
    const remove = await apiPatch(baseUrl, `/api/roles/${created.id}/permissions`, adminToken, {
      permissionId: 'users:read',
    });
    expect(remove.status).toBe(200);

    // THEN - effective access is revoked and the role is empty again
    expect((await apiGet(baseUrl, '/api/users', token)).status).toBe(403);
    const afterRemove = await (await apiGet(baseUrl, '/api/roles', adminToken)).json();
    expect(afterRemove.find((r) => r.id === created.id).permissionsDump).toEqual([]);
  });

  it('rejects toggling a permission on a non-existent role (404)', async () => {
    // GIVEN - a role id that does not exist
    const missingId = '00000000-0000-0000-0000-000000000000';

    // WHEN - an admin toggles a permission on it
    const res = await apiPatch(baseUrl, `/api/roles/${missingId}/permissions`, adminToken, {
      permissionId: 'users:read',
    });

    // THEN - the request is rejected as not found
    expect(res.status).toBe(404);
  });

  it('keeps roles isolated: managing one role does not change another role effective permissions', async () => {
    // GIVEN - two independent roles, each with a user, one granting users:read
    const roleX = await (await apiPost(baseUrl, '/api/roles', adminToken, {
      name: `X-${Date.now()}`,
      description: 'Concede users:read',
      permissions: ['users:read'],
    })).json();
    const roleY = await (await apiPost(baseUrl, '/api/roles', adminToken, {
      name: `Y-${Date.now()}`,
      description: 'Não concede nada',
      permissions: [],
    })).json();

    const userX = await createUser(models, { roleId: roleX.id, actorId });
    const tokenX = await createSession(models, { userId: userX.id });
    const userY = await createUser(models, { roleId: roleY.id, actorId });
    const tokenY = await createSession(models, { userId: userY.id });

    expect((await apiGet(baseUrl, '/api/users', tokenX)).status).toBe(200);
    expect((await apiGet(baseUrl, '/api/users', tokenY)).status).toBe(403);

    // WHEN - role X has its users:read permission removed
    const toggle = await apiPatch(baseUrl, `/api/roles/${roleX.id}/permissions`, adminToken, {
      permissionId: 'users:read',
    });
    expect(toggle.status).toBe(200);

    // THEN - role X user loses access, while role Y is entirely unaffected
    expect((await apiGet(baseUrl, '/api/users', tokenX)).status).toBe(403);
    expect((await apiGet(baseUrl, '/api/users', tokenY)).status).toBe(403);
  });
});
