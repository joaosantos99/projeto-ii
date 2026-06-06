import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { startTestDatabase } from '../helpers/db.js';
import { apiDelete, apiGet, apiPut, buildApp, close, listen } from '../helpers/app.js';
import { assignRole, createActor, createRole, createSession, createUser } from '../helpers/factories.js';

describe('Immediate permission update after role change', () => {
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

    // Admin can read + update roles; used to drive permission toggles over HTTP.
    const adminRole = await createRole(models, {
      name: 'admin',
      permissions: ['roles:read', 'roles:update', 'users:read'],
      actorId,
    });
    const admin = await createUser(models, { roleId: adminRole.id, actorId });
    adminToken = await createSession(models, { userId: admin.id });
  }, 120_000);

  afterAll(async () => {
    if (server) await close(server);
    if (db) await db.stop();
  });

  it('grants access on the next request after a permission is added to the role', async () => {
    // GIVEN - a user whose role has no permissions, holding a valid token
    const role = await createRole(models, { permissions: [], actorId });
    const user = await createUser(models, { roleId: role.id, actorId });
    const token = await createSession(models, { userId: user.id });

    // AND - that token is currently rejected from a roles:read resource
    const before = await apiGet(baseUrl, '/api/roles', token);
    expect(before.status).toBe(403);

    // WHEN - an admin grants the roles:read permission to that role
    const grant = await apiPut(baseUrl, `/api/roles/${role.id}/permissions/roles:read`, adminToken);
    expect(grant.status).toBe(200);

    // THEN - the SAME token is immediately allowed — no re-login required
    const after = await apiGet(baseUrl, '/api/roles', token);
    expect(after.status).toBe(200);
  });

  it('revokes access on the next request after a permission is removed from the role', async () => {
    // GIVEN - a user whose role grants roles:read, holding a valid token
    const role = await createRole(models, { permissions: ['roles:read'], actorId });
    const user = await createUser(models, { roleId: role.id, actorId });
    const token = await createSession(models, { userId: user.id });

    // AND - that token can currently reach the roles:read resource
    const before = await apiGet(baseUrl, '/api/roles', token);
    expect(before.status).toBe(200);

    // WHEN - an admin revokes roles:read from that role
    const revoke = await apiDelete(baseUrl, `/api/roles/${role.id}/permissions/roles:read`, adminToken);
    expect(revoke.status).toBe(204);

    // THEN - the SAME token is immediately rejected
    const after = await apiGet(baseUrl, '/api/roles', token);
    expect(after.status).toBe(403);
  });

  it('applies the new role permissions immediately after the user is reassigned to another role', async () => {
    // GIVEN - two roles: A grants nothing, B grants users:read
    const roleA = await createRole(models, { permissions: [], actorId });
    const roleB = await createRole(models, { permissions: ['users:read'], actorId });

    // AND - a user on role A holding a valid token, rejected from a users:read resource
    const user = await createUser(models, { roleId: roleA.id, actorId });
    const token = await createSession(models, { userId: user.id });

    const before = await apiGet(baseUrl, '/api/users', token);
    expect(before.status).toBe(403);

    // WHEN - the user is reassigned from role A to role B
    await assignRole(models, user.id, roleB.id);

    // THEN - the SAME token immediately gains role B's permissions
    const after = await apiGet(baseUrl, '/api/users', token);
    expect(after.status).toBe(200);
  });

  it('loses the old role permissions immediately after the user is reassigned away from it', async () => {
    // GIVEN - a privileged role with users:read and a bare role with nothing
    const privileged = await createRole(models, { permissions: ['users:read'], actorId });
    const bare = await createRole(models, { permissions: [], actorId });

    // AND - a user on the privileged role holding a valid token that currently works
    const user = await createUser(models, { roleId: privileged.id, actorId });
    const token = await createSession(models, { userId: user.id });

    const before = await apiGet(baseUrl, '/api/users', token);
    expect(before.status).toBe(200);

    // WHEN - the user is reassigned to the bare role
    await assignRole(models, user.id, bare.id);

    // THEN - the SAME token is immediately rejected on the next request
    const after = await apiGet(baseUrl, '/api/users', token);
    expect(after.status).toBe(403);
  });
});
