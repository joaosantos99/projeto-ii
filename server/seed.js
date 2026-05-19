import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

import sequelize from './src/database/connection.js';
import Users from './src/database/models/Users.js';
import Roles from './src/database/models/Roles.js';
import GreenSpaces from './src/database/models/GreenSpaces.js';

const DATA_SCALE = 1;

let systemOwner;
let managerRole;
let tecnicalRole;

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
    password_hash: await bcrypt.hash("123456789a", 12),
    role_id: adminRole.id,
    created_by: 'system',
    updated_by: 'system',
  });

  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
};

const generateRoles = async () => {
  managerRole = await Roles.create({
    name: 'Gestor',
    created_by: systemOwner.id,
    updated_by: systemOwner.id,
  });
  tecnicalRole = await Roles.create({
    name: 'Técnico',
    created_by: systemOwner.id,
    updated_by: systemOwner.id,
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
      password_hash: await bcrypt.hash("123456789a", 12),
      role_id: i % 2 === 0 ? managerRole.id : tecnicalRole.id,
      created_by: systemOwner.id,
      updated_by: systemOwner.id,
    });
  }

  await Users.bulkCreate(users);
}

const generateGreenSpaces = async () => {
  const greenSpacesCount = 100 * DATA_SCALE;
  const greenSpaces = [];

  for (let i = 0; i < greenSpacesCount; i++) {
    greenSpaces.push({
      name: faker.location.city() + ' Park',
      city: faker.location.city(),
      postal_code: faker.location.zipCode(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      created_by: systemOwner.id,
      updated_by: systemOwner.id
    });
  }

  await GreenSpaces.bulkCreate(greenSpaces);
};

await generateSystemOwner();
await generateRoles();
await generateUsers();
await generateGreenSpaces();