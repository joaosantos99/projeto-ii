import { faker } from '@faker-js/faker';

import sequelize from './src/database/connection.js';
import Users from './src/database/models/Users.js';
import Roles from './src/database/models/Roles.js';
import MaintenanceTasks from './src/database/models/MaintenanceTasks.js';
import GreenSpaces from './src/database/models/GreenSpaces.js';

const DATA_SCALE = 1;

let systemOwner;

const generateSystemOwner = async () => {
  const systemOwnerFirstName = faker.person.firstName();
  const systemOwnerLastName = faker.person.lastName();

  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

  const adminRole = await Roles.create({
    name: 'Admin',
    created_by: 'system',
    updated_by: 'system',
  });

  systemOwner = await Users.create({
    full_name: `${systemOwnerFirstName} ${systemOwnerLastName}`,
    email: faker.internet.email({
      firstName: systemOwnerFirstName,
      lastName: systemOwnerLastName,
      provider: 'cm-viladoconde.pt',
    }),
    password_hash: faker.internet.password(),
    role_id: adminRole.id,
    created_by: 'system',
    updated_by: 'system',
  });

  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
};

const generateRoles = async () => {
  const systemOwnerRole = await Roles.create({
    name: 'system_owner',
    created_by: 'system',
    updated_by: 'system',
  });
};

const generateUsers = async () => {
  const usersCount = 100 * DATA_SCALE;

  const users = [];
  for (let i = 0; i < usersCount; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    users.push({
      full_name: `${firstName} ${lastName}`,
      email: faker.internet.email({
        firstName,
        lastName,
        provider: 'cm-viladoconde.pt',
      }),
      password_hash: faker.internet.password(),
      created_by: systemOwner.id,
      updated_by: systemOwner.id,
    });
  }

  await Users.bulkCreate(users);
};

const generateMaintenanceTasks = async () => {
  const tasksCount = 100 * DATA_SCALE;

  const greenSpaces = await GreenSpaces.findAll({ attributes: ['id'] });
  const greenSpaceIds = greenSpaces.map((gs) => gs.id);

  const types = ['pruning', 'irrigation', 'fertilization', 'pest_control', 'mowing', 'cleaning'];
  const statuses = ['pending', 'in_progress', 'completed', 'cancelled'];

  const tasks = [];

  for (let i = 0; i < tasksCount; i++) {
    const status = faker.helpers.arrayElement(statuses);
    const scheduledDate = faker.date.between({
      from: '2024-01-01',
      to: '2026-03-31',
    });

    tasks.push({
      green_spaces_id: faker.helpers.arrayElement(greenSpaceIds),
      type: faker.helpers.arrayElement(types),
      description: faker.lorem.sentence(),
      status,
      scheduled_date: scheduledDate,
      completed_at:
        status === 'completed'
          ? faker.date.between({ from: scheduledDate, to: new Date() })
          : null,
      created_by: systemOwner.id,
      updated_by: systemOwner.id,
    });
  }

  await MaintenanceTasks.bulkCreate(tasks);
};

await generateSystemOwner();
await generateUsers();
