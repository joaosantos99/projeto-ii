import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Sequelize } from 'sequelize';
import { MySqlContainer } from '@testcontainers/mysql';

const MIGRATIONS_DIR = fileURLToPath(new URL('../../database/migrations', import.meta.url));

async function runMigrations(sequelize) {
  const queryInterface = sequelize.getQueryInterface();
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.js'))
    .sort();

  for (const file of files) {
    const mod = await import(pathToFileURL(path.join(MIGRATIONS_DIR, file)).href);
    await mod.default.up(queryInterface, Sequelize);
  }
}

export async function startTestDatabase() {
  const container = await new MySqlContainer('mysql:8.0').start();

  process.env.DB_NAME = container.getDatabase();
  process.env.DB_USER = container.getUsername();
  process.env.DB_PASSWORD = container.getUserPassword();
  process.env.DB_HOST = container.getHost();
  process.env.DB_PORT = String(container.getPort());

  const sequelize = (await import('../../database/connection.js')).default;
  const models = (await import('../../database/models/index.js')).default;

  await sequelize.authenticate();
  await runMigrations(sequelize);

  return {
    container,
    sequelize,
    models,
    async stop() {
      await sequelize.close();
      await container.stop();
    },
  };
}

export async function seedAdminUser(models, id) {
  await models.Users.create({
    id,
    role_id: id, // role_id carries no DB-level FK in the migration
    full_name: 'Seed Admin',
    email: `admin-${id}@test.local`,
    password_hash: 'x',
    created_by: id,
    updated_by: id,
  });
  return id;
}
