import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

import sequelize from './src/database/connection.js';
import Users from './src/database/models/Users.js';
import Roles from './src/database/models/Roles.js';
import GreenSpaces from './src/database/models/GreenSpaces.js';
import MaintenanceTasks from './src/database/models/MaintenanceTasks.js';
import GreenSpaceZones from './src/database/models/GreenSpaceZones.js';
import Sensors from './src/database/models/Sensors.js';
import SensorReadingMetas from './src/database/models/SensorReadingMetas.js';
import Alerts from './src/database/models/Alerts.js';
import Reports from './src/database/models/Reports.js';
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

const PORTO_PARKS = [
  { name: 'Parque da Cidade', parish: 'Aldoar Foz do Douro e Nevogilde', postal_code: '4100-341', latitude: 41.1686, longitude: -8.6745 },
  { name: 'Jardins do Palácio de Cristal', parish: 'Cedofeita Santo Ildefonso Sé Miragaia São Nicolau e Vitória', postal_code: '4050-345', latitude: 41.1476, longitude: -8.6259 },
  { name: 'Parque Oriental da Cidade do Porto', parish: 'Campanhã', postal_code: '4300-150', latitude: 41.1601, longitude: -8.5672 },
  { name: 'Parque de Serralves', parish: 'Lordelo do Ouro e Massarelos', postal_code: '4150-708', latitude: 41.1594, longitude: -8.6596 },
  { name: 'Parque de São Roque', parish: 'Campanhã', postal_code: '4350-302', latitude: 41.1578, longitude: -8.5831 },
  { name: 'Parque das Virtudes', parish: 'Cedofeita Santo Ildefonso Sé Miragaia São Nicolau e Vitória', postal_code: '4050-621', latitude: 41.1441, longitude: -8.6186 },
  { name: 'Jardim do Passeio Alegre', parish: 'Aldoar Foz do Douro e Nevogilde', postal_code: '4150-571', latitude: 41.1481, longitude: -8.6733 },
  { name: 'Jardim Botânico do Porto', parish: 'Lordelo do Ouro e Massarelos', postal_code: '4150-181', latitude: 41.1528, longitude: -8.6425 },
  { name: 'Quinta do Covelo', parish: 'Paranhos', postal_code: '4200-516', latitude: 41.1684, longitude: -8.6042 },
  { name: 'Jardim da Cordoaria', parish: 'Cedofeita Santo Ildefonso Sé Miragaia São Nicolau e Vitória', postal_code: '4050-310', latitude: 41.1465, longitude: -8.6158 },
  { name: 'Jardim de São Lázaro', parish: 'Cedofeita Santo Ildefonso Sé Miragaia São Nicolau e Vitória', postal_code: '4000-508', latitude: 41.1461, longitude: -8.6028 },
  { name: 'Parque Urbano da Pasteleira', parish: 'Lordelo do Ouro e Massarelos', postal_code: '4150-580', latitude: 41.1511, longitude: -8.6624 },
  { name: "Jardim de Arca d'Água", parish: 'Paranhos', postal_code: '4200-419', latitude: 41.1731, longitude: -8.6115 },
];

const generateGreenSpaces = async () => {
  const greenSpaces = PORTO_PARKS.map((park) => ({
    ...park,
    image_url: 'https://fsn1.your-objectstorage.com/projeto-ii/spaces/3158918e-b622-49fc-b5a3-bc8cd3e74729/1780734253250.jpg',
    created_by: systemOwner.id,
    updated_by: systemOwner.id,
  }));

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

  const cardParams = [
    { type: 'soil', parameter: 'soil_moisture', unit: '%', minRange: [25, 35], maxRange: [60, 75], frac: 0 },
    { type: 'temperature', parameter: 'air_temperature', unit: '°C', minRange: [6, 11], maxRange: [28, 35], frac: 1 },
    { type: 'air', parameter: 'co2', unit: 'ppm', minRange: [380, 420], maxRange: [600, 850], frac: 0 },
    { type: 'sound', parameter: 'noise', unit: 'dB', minRange: [35, 45], maxRange: [65, 80], frac: 0 },
  ];

  const extraParams = [
    { type: 'humidity', parameter: 'air_humidity', unit: '%', minRange: [40, 55], maxRange: [80, 92], frac: 0 },
    { type: 'soil', parameter: 'soil_ph', unit: 'pH', minRange: [5.8, 6.4], maxRange: [7.0, 7.6], frac: 1 },
    { type: 'light', parameter: 'luminosity', unit: 'lux', minRange: [100, 600], maxRange: [55000, 95000], frac: 0 },
  ];

  const valueIn = ([lo, hi], frac) =>
    Number(faker.number.float({ min: lo, max: hi, fractionDigits: frac }).toFixed(frac));

  const sensors = [];

  for (const zone of zones) {
    const params = [...cardParams, ...faker.helpers.arrayElements(extraParams, { min: 0, max: 2 })];

    for (const param of params) {
      sensors.push({
        id: faker.string.uuid(),
        green_space_zone_id: zone.id,
        green_space_id: zone.green_spaces_id,
        type: param.type,
        parameter: param.parameter,
        unit: param.unit,
        min_value: valueIn(param.minRange, param.frac),
        max_value: valueIn(param.maxRange, param.frac),
        is_active: faker.datatype.boolean(0.8),
        created_by: systemOwner.id,
        updated_by: systemOwner.id,
      });
    }
  }

  await Sensors.bulkCreate(
    sensors.map(({ green_space_id, ...rest }) => rest),
  );

  return sensors;
};

const generateSensorReadingMetas = async (sensors) => {
  const readings = [];

  for (const sensor of sensors) {
    const readingCount = 10 * DATA_SCALE;

    for (let i = 0; i < readingCount; i++) {
      readings.push({
        id: faker.string.uuid(),
        sensor_id: sensor.id,
        green_space_id: sensor.green_space_id,
        recorded_at: faker.date.between({
          from: '2024-01-01',
          to: new Date(),
        }),
        is_valid: faker.datatype.boolean(0.9),
      });
    }
  }

  await SensorReadingMetas.bulkCreate(readings);
};

const generateAlerts = async (sensors) => {
  const severities = ['low', 'medium', 'high', 'critical'];
  const alerts = [];

  for (const sensor of sensors) {
    const alertCount = faker.number.int({ min: 0, max: 3 });

    for (let i = 0; i < alertCount; i++) {
      alerts.push({
        sensor_id: sensor.id,
        green_space_id: sensor.green_space_id,
        severity: faker.helpers.arrayElement(severities),
        message: faker.lorem.sentence(),
        is_notified: faker.datatype.boolean(),
        created_by: systemOwner.id,
      });
    }
  }

  await Alerts.bulkCreate(alerts);
};

const generateReports = async () => {
  const reportsCount = 50 * DATA_SCALE;

  const zones = await GreenSpaceZones.findAll({
    attributes: ['id', 'green_spaces_id'],
  });
  const users = await Users.findAll({ attributes: ['id'] });
  const userIds = users.map((u) => u.id);

  const types = ['incident', 'inspection', 'damage', 'request'];
  const statuses = ['open', 'in_review', 'resolved', 'rejected'];

  const reports = [];

  for (let i = 0; i < reportsCount; i++) {
    const zone = faker.helpers.arrayElement(zones);

    reports.push({
      user_id: faker.helpers.arrayElement(userIds),
      green_space_id: zone.green_spaces_id,
      green_spaces_zone_id: zone.id,
      name: faker.lorem.words(3),
      type: faker.helpers.arrayElement(types),
      description: faker.lorem.paragraph(),
      status: faker.helpers.arrayElement(statuses),
      updated_by: systemOwner.id,
    });
  }

  await Reports.bulkCreate(reports);
};

await generateSystemOwner();
await generateRoles();
await generateUsers();
await generateGreenSpaces();
await generateMaintenanceTasks();
await generateGreenSpaceZones();
const seededSensors = await generateSensors();
await generateSensorReadingMetas(seededSensors);
await generateAlerts(seededSensors);
await generateReports();
