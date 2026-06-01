import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug } from 'umzug';

import sequelize from './connection.js';

const dir = path.dirname(fileURLToPath(import.meta.url));

const umzug = new Umzug({
  migrations: {
    glob: ['migrations/*.js', { cwd: dir }],
    resolve: ({ name, path: filepath, context }) => ({
      name,
      up: async () => {
        const { default: m } = await import(pathToFileURL(filepath).href);
        return m.up(context, Sequelize);
      },
      down: async () => {
        const { default: m } = await import(pathToFileURL(filepath).href);
        return m.down(context, Sequelize);
      },
    }),
  },
  context: sequelize.getQueryInterface(),
  // Same table sequelize-cli uses, so existing history stays compatible.
  storage: new SequelizeStorage({ sequelize, tableName: 'SequelizeMeta' }),
  logger: console,
});

if (process.argv.includes('--down')) {
  await umzug.down();
} else {
  await umzug.up();
}
await sequelize.close();
