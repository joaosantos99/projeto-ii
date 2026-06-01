import crypto from 'node:crypto';
import bcrypt from 'bcrypt';

export async function createActor(models) {
  const id = crypto.randomUUID();
  await models.Users.create({
    id,
    role_id: crypto.randomUUID(), // role_id has no DB-level FK in the migration
    full_name: 'Test Actor',
    email: `actor-${id}@test.local`,
    password_hash: 'x',
    created_by: id,
    updated_by: id,
  });
  return id;
}

export async function createRole(models, { name, permissions = [], actorId }) {
  return models.Roles.create({
    name: name ?? `role-${crypto.randomUUID()}`,
    permissions,
    created_by: actorId,
    updated_by: actorId,
  });
}

export async function createUser(models, { roleId, actorId, email, fullName = 'Test User', password = 'password123' }) {
  const passwordHash = await bcrypt.hash(password, 10);
  return models.Users.create({
    role_id: roleId,
    full_name: fullName,
    email: email ?? `user-${crypto.randomUUID()}@test.local`,
    password_hash: passwordHash,
    created_by: actorId,
    updated_by: actorId,
  });
}

export async function createSession(models, { userId, token, expiresInMs = 60 * 60 * 1000 }) {
  const sessionToken = token ?? crypto.randomBytes(32).toString('hex');
  await models.Sessions.create({
    user_id: userId,
    token: sessionToken,
    expires_at: new Date(Date.now() + expiresInMs),
  });
  return sessionToken;
}

export async function assignRole(models, userId, roleId) {
  await models.Users.update({ role_id: roleId }, { where: { id: userId } });
}
