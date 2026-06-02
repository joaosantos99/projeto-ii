import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

import sequelize from './src/database/connection.js';
import Users from './src/database/models/Users.js';
import Roles from './src/database/models/Roles.js';
import GreenSpaces from './src/database/models/GreenSpaces.js';
import MaintenanceTasks from './src/database/models/MaintenanceTasks.js';
import GreenSpaceZones from './src/database/models/GreenSpaceZones.js';
import Sensors from './src/database/models/Sensors.js';
import { PERMISSIONS } from './src/constants/permissions.js';

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
    permissions: Object.values(PERMISSIONS),
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

const generateGreenSpaceZones = async () => {
  const greenSpaces = await GreenSpaces.findAll({ attributes: ['id'] });
  const greenSpaceIds = greenSpaces.map((gs) => gs.id);

  const zones = [];

  for (const greenSpaceId of greenSpaceIds) {
    const zoneCount = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < zoneCount; i++) {
      zones.push({
        id: faker.string.uuid(),
        green_spaces_id: greenSpaceId,
        name: `Zone ${i + 1} - ${faker.location.street()}`,
        created_by: systemOwner.id,
        updated_by: systemOwner.id,
      });
    }
  }

  await GreenSpaceZones.bulkCreate(zones);
};

const generateSensors = async () => {
  const zones = await GreenSpaceZones.findAll({
    attributes: ['id', 'green_spaces_id'],
  });

  const sensorParams = [
    { type: 'temperature', parameter: 'air_temperature', unit: '°C', min: -5, max: 45 },
    { type: 'humidity', parameter: 'air_humidity', unit: '%', min: 0, max: 100 },
    { type: 'soil', parameter: 'soil_moisture', unit: '%', min: 0, max: 100 },
    { type: 'soil', parameter: 'soil_ph', unit: 'pH', min: 3, max: 9 },
    { type: 'light', parameter: 'luminosity', unit: 'lux', min: 0, max: 100000 },
  ];

  const sensors = [];

  for (const zone of zones) {
    const sensorCount = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < sensorCount; i++) {
      const param = faker.helpers.arrayElement(sensorParams);

      sensors.push({
        id: faker.string.uuid(),
        green_space_zone_id: zone.id,
        green_space_id: zone.green_spaces_id,
        type: param.type,
        parameter: param.parameter,
        unit: param.unit,
        min_value: param.min,
        max_value: param.max,
        is_active: faker.datatype.boolean(0.8),
        created_by: systemOwner.id,
        updated_by: systemOwner.id,
      });
    }
  }

  // strip helper field not in model before insert
  await Sensors.bulkCreate(
    sensors.map(({ green_space_id, ...rest }) => rest),
  );

  return sensors;
};

await generateSystemOwner();
await generateRoles();
await generateUsers();
await generateGreenSpaces();
await generateMaintenanceTasks();
await generateGreenSpaceZones();
const seededSensors = await generateSensors();
