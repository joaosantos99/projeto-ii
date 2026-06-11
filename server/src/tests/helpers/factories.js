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

export async function createGreenSpace(models, { name, parish, postalCode = '1000-001', actorId}) {
  return models.GreenSpaces.create({
    name: name ?? `Space-${crypto.randomUUID()}`,
    parish: parish ?? 'Lisboa',
    postal_code: postalCode,
    latitude: 38.7,
    longitude: -9.1,
    created_by: actorId,
    updated_by: actorId,
  })
} 

export async function createZone(models, { spaceId, name = 'Zona Teste', actorId }) {
  return models.GreenSpaceZones.create({
    green_spaces_id: spaceId,
    name,
    created_by: actorId,
    updated_by: actorId
  })
}

export async function createSensor(models, { zoneId, actorId }) {
  return models.Sensors.create({
    green_space_zone_id: zoneId,
    type: 'humidity',
    parameter: 'Humidade',
    unit: '%',
    min_value: 20,
    max_value: 80,
    is_active: true,
    created_by: actorId,
    updated_by: actorId
  })
}

export async function createAlert(models, { spaceId, sensorId, actorId, severity = 'critical', message = 'Teste' }) {
  return models.Alerts.create({
    green_space_id: spaceId,
    sensor_id: sensorId,
    severity,
    message,
    is_notified: false,
    created_by: actorId
  })
} 