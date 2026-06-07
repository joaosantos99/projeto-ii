import bcrypt from 'bcrypt';

import sequelize from './src/database/connection.js';
import Users from './src/database/models/Users.js';
import Roles from './src/database/models/Roles.js';
import GreenSpaces from './src/database/models/GreenSpaces.js';
import GreenSpaceZones from './src/database/models/GreenSpaceZones.js';
import Sensors from './src/database/models/Sensors.js';
import SensorReadingMetas from './src/database/models/SensorReadingMetas.js';
import MaintenanceTasks from './src/database/models/MaintenanceTasks.js';
import Alerts from './src/database/models/Alerts.js';
import Reports from './src/database/models/Reports.js';
import { PERMISSIONS } from './src/constants/permissions.js';

const P = PERMISSIONS;
const DOMAIN = 'mailinator.com';

// ── Perfis (roles) com permissões coerentes ───────────────────────────────
const ROLES = [
  {
    key: 'admin',
    name: 'Administrador',
    permissions: Object.values(P),
  },
  {
    key: 'gestor',
    name: 'Gestor de Espaços Verdes',
    permissions: [
      P.USERS_READ,
      P.ROLES_READ,
      P.REPORTS_READ,
      P.SPACES_READ, P.SPACES_CREATE, P.SPACES_UPDATE, P.SPACES_DELETE,
    ],
  },
  {
    key: 'tecnico',
    name: 'Técnico de Manutenção',
    permissions: [P.SPACES_READ, P.REPORTS_READ, P.REPORTS_CREATE],
  },
  {
    key: 'atendimento',
    name: 'Atendimento ao Munícipe',
    permissions: [P.SPACES_READ, P.REPORTS_READ, P.REPORTS_CREATE],
  },
];

// ── Pessoal municipal ──────────────────────────────────────────────────────
const STAFF = [
  { full_name: 'Sofia Almeida', email: `admin@${DOMAIN}`, role: 'admin' },
  { full_name: 'Miguel Ferreira', email: `miguel.ferreira@${DOMAIN}`, role: 'gestor' },
  { full_name: 'Ana Costa', email: `ana.costa@${DOMAIN}`, role: 'gestor' },
  { full_name: 'João Pereira', email: `joao.pereira@${DOMAIN}`, role: 'tecnico' },
  { full_name: 'Carla Sousa', email: `carla.sousa@${DOMAIN}`, role: 'tecnico' },
  { full_name: 'Pedro Carvalho', email: `pedro.carvalho@${DOMAIN}`, role: 'tecnico' },
  { full_name: 'Mariana Lopes', email: `mariana.lopes@${DOMAIN}`, role: 'atendimento' },
];

// ── Espaços verdes do Porto ────────────────────────────────────────────────
const PORTO_PARKS = [
  { name: 'Parque da Cidade', parish: 'Aldoar Foz do Douro e Nevogilde', postal_code: '4100-341', latitude: 41.1686, longitude: -8.6745, image_url: 'https://fsn1.your-objectstorage.com/projeto-ii/spaces/fa7275d8-ed91-463d-b9a8-9f419bd9159a/1780865834486.jpg' },
  { name: 'Jardins do Palácio de Cristal', parish: 'Cedofeita Santo Ildefonso Sé Miragaia São Nicolau e Vitória', postal_code: '4050-345', latitude: 41.1476, longitude: -8.6259, image_url: 'https://fsn1.your-objectstorage.com/projeto-ii/spaces/d691aaa8-1cbe-4c2d-af38-9b6bcf37a9ab/1780865883073.jpg' },
  { name: 'Parque Oriental da Cidade do Porto', parish: 'Campanhã', postal_code: '4300-150', latitude: 41.1601, longitude: -8.5672, image_url: 'https://fsn1.your-objectstorage.com/projeto-ii/spaces/78fd0e65-46bc-40e5-bb85-6c8dfc117e3a/1780865439835.jpg' },
  { name: 'Parque de São Roque', parish: 'Campanhã', postal_code: '4350-302', latitude: 41.1578, longitude: -8.5831, image_url: 'https://fsn1.your-objectstorage.com/projeto-ii/spaces/fd139ff8-4ed4-43a8-a105-2705255fc395/1780865529071.jpg' },
  { name: 'Parque das Virtudes', parish: 'Cedofeita Santo Ildefonso Sé Miragaia São Nicolau e Vitória', postal_code: '4050-621', latitude: 41.1441, longitude: -8.6186, image_url: 'https://fsn1.your-objectstorage.com/projeto-ii/spaces/7130a76e-6dcf-4faf-bd5d-8faedcf7cde8/1780865806040.jpg' },
  { name: 'Jardim do Passeio Alegre', parish: 'Aldoar Foz do Douro e Nevogilde', postal_code: '4150-571', latitude: 41.1481, longitude: -8.6733, image_url: 'https://fsn1.your-objectstorage.com/projeto-ii/spaces/684eac86-e4b1-4554-929c-77182fe20e85/1780865923014.jpg' },
  { name: 'Jardim Botânico do Porto', parish: 'Lordelo do Ouro e Massarelos', postal_code: '4150-181', latitude: 41.1528, longitude: -8.6425, image_url: 'https://fsn1.your-objectstorage.com/projeto-ii/spaces/9606a453-2938-46ce-9673-71462182fb89/1780865991754.jpg' },
  { name: 'Quinta do Covelo', parish: 'Paranhos', postal_code: '4200-516', latitude: 41.1684, longitude: -8.6042, image_url: 'https://fsn1.your-objectstorage.com/projeto-ii/spaces/31c22734-23e9-4666-a81a-0b9de7ed3296/1780865214036.jpg' },
  { name: 'Jardim da Cordoaria', parish: 'Cedofeita Santo Ildefonso Sé Miragaia São Nicolau e Vitória', postal_code: '4050-310', latitude: 41.1465, longitude: -8.6158, image_url: 'https://fsn1.your-objectstorage.com/projeto-ii/spaces/447a5143-c0e3-4e38-b5fd-8bdf967f34c8/1780865962363.webp' },
  { name: 'Parque Urbano da Pasteleira', parish: 'Lordelo do Ouro e Massarelos', postal_code: '4150-580', latitude: 41.1511, longitude: -8.6624, image_url: 'https://fsn1.your-objectstorage.com/projeto-ii/spaces/10ad1c7b-9595-483b-a748-45c6473389a2/1780865358105.jpg' },
];

// Duas zonas coerentes por espaço.
const ZONE_NAMES = ['Zona Norte', 'Zona Sul'];

// Sensores base de cada zona (valores mín/máx de referência).
const SENSOR_TYPES = [
  { type: 'soil', parameter: 'soil_moisture', unit: '%', min_value: 30, max_value: 70 },
  { type: 'temperature', parameter: 'air_temperature', unit: '°C', min_value: 8, max_value: 32 },
  { type: 'air', parameter: 'co2', unit: 'ppm', min_value: 400, max_value: 750 },
  { type: 'sound', parameter: 'noise', unit: 'dB', min_value: 40, max_value: 72 },
];

const MAINTENANCE = [
  { type: 'pruning', status: 'completed', description: 'Poda de árvores e arbustos na entrada principal.' },
  { type: 'irrigation', status: 'in_progress', description: 'Revisão do sistema de rega automática.' },
  { type: 'mowing', status: 'pending', description: 'Corte de relva nos relvados centrais.' },
  { type: 'cleaning', status: 'completed', description: 'Limpeza de caminhos e recolha de resíduos.' },
  { type: 'fertilization', status: 'pending', description: 'Aplicação de fertilizante nos canteiros.' },
  { type: 'pest_control', status: 'cancelled', description: 'Tratamento fitossanitário adiado por condições meteorológicas.' },
];

const REPORTS = [
  { name: 'Banco partido', type: 'damage', status: 'open', description: 'Banco de jardim danificado junto ao lago.' },
  { name: 'Iluminação avariada', type: 'incident', status: 'in_review', description: 'Candeeiro sem funcionar no caminho principal.' },
  { name: 'Pedido de poda', type: 'request', status: 'open', description: 'Ramos a obstruir o passeio pedonal.' },
  { name: 'Inspeção periódica', type: 'inspection', status: 'resolved', description: 'Inspeção de rotina aos equipamentos infantis.' },
  { name: 'Rega insuficiente', type: 'incident', status: 'resolved', description: 'Zona com relva seca por falha de rega.' },
  { name: 'Lixo acumulado', type: 'damage', status: 'rejected', description: 'Acumulação de resíduos fora do horário de recolha.' },
];

const main = async () => {
  const existing = await Users.count();
  if (existing > 0) {
    console.log(`[seed:prod] Base já populada (${existing} utilizadores). Nada a fazer.`);
    return;
  }

  console.log('[seed:prod] Base vazia — a criar dados de bootstrap...');
  const password_hash = await bcrypt.hash('123456789a', 12);

  // Perfil de Administrador e utilizador admin primeiro (ovo-galinha nas FKs
  // de auditoria), com as verificações de FK desligadas tal como no seed dev.
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

  const adminRoleDef = ROLES.find((r) => r.key === 'admin');
  const adminRole = await Roles.create({
    name: adminRoleDef.name,
    permissions: adminRoleDef.permissions,
    created_by: 'system',
    updated_by: 'system',
  });

  const adminStaff = STAFF.find((s) => s.role === 'admin');
  const admin = await Users.create({
    full_name: adminStaff.full_name,
    email: adminStaff.email,
    password_hash,
    role_id: adminRole.id,
    created_by: 'system',
    updated_by: 'system',
  });

  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

  // Restantes perfis (auditados pelo admin).
  const roleByKey = { admin: adminRole };
  for (const def of ROLES.filter((r) => r.key !== 'admin')) {
    roleByKey[def.key] = await Roles.create({
      name: def.name,
      permissions: def.permissions,
      created_by: admin.id,
      updated_by: admin.id,
    });
  }

  // Restantes utilizadores.
  await Users.bulkCreate(
    STAFF.filter((s) => s.role !== 'admin').map((s) => ({
      full_name: s.full_name,
      email: s.email,
      password_hash,
      role_id: roleByKey[s.role].id,
      created_by: admin.id,
      updated_by: admin.id,
    })),
  );

  // Espaços verdes. bulkCreate devolve instâncias com o id (UUIDV4) já gerado.
  const spaces = await GreenSpaces.bulkCreate(
    PORTO_PARKS.map((park) => ({
      ...park,
      created_by: admin.id,
      updated_by: admin.id,
    })),
  );

  // Zonas (2 por espaço) + sensores (4 por zona).
  const zones = await GreenSpaceZones.bulkCreate(
    spaces.flatMap((space) =>
      ZONE_NAMES.map((name) => ({
        green_spaces_id: space.id,
        name,
        created_by: admin.id,
        updated_by: admin.id,
      })),
    ),
  );

  const sensors = await Sensors.bulkCreate(
    zones.flatMap((zone) =>
      SENSOR_TYPES.map((s) => ({
        green_space_zone_id: zone.id,
        type: s.type,
        parameter: s.parameter,
        unit: s.unit,
        min_value: s.min_value,
        max_value: s.max_value,
        is_active: true,
        created_by: admin.id,
        updated_by: admin.id,
      })),
    ),
  );

  // Tarefas de manutenção — uma por espaço, em rotação.
  const baseDate = new Date('2026-04-01T09:00:00Z');
  const tasks = spaces.map((space, i) => {
    const m = MAINTENANCE[i % MAINTENANCE.length];
    const scheduled = new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000);
    return {
      green_spaces_id: space.id,
      type: m.type,
      description: m.description,
      status: m.status,
      scheduled_date: scheduled,
      completed_at:
        m.status === 'completed'
          ? new Date(scheduled.getTime() + 2 * 60 * 60 * 1000)
          : null,
      created_by: admin.id,
      updated_by: admin.id,
    };
  });
  await MaintenanceTasks.bulkCreate(tasks);

  // Ocorrências — uma por espaço, em rotação, atribuídas ao atendimento.
  const atendimento = await Users.findOne({
    where: { email: `mariana.lopes@${DOMAIN}` },
  });
  const reports = spaces.map((space, i) => {
    const r = REPORTS[i % REPORTS.length];
    const zone = zones.find((z) => z.green_spaces_id === space.id);
    return {
      user_id: atendimento.id,
      green_space_id: space.id,
      green_spaces_zone_id: zone ? zone.id : null,
      name: r.name,
      type: r.type,
      description: r.description,
      status: r.status,
      updated_by: admin.id,
    };
  });
  await Reports.bulkCreate(reports);

  // Alguns alertas em sensores de ruído/CO2.
  const alertDefs = [
    { parameter: 'noise', severity: 'high', message: 'Nível de ruído acima do limite recomendado.' },
    { parameter: 'co2', severity: 'medium', message: 'Concentração de CO2 elevada.' },
    { parameter: 'soil_moisture', severity: 'low', message: 'Humidade do solo abaixo do ideal.' },
  ];
  const zoneSpace = new Map(zones.map((z) => [z.id, z.green_spaces_id]));

  // Leituras de sensores — uma leitura recente por sensor, com o payload bruto
  // em `dump`. A UI mostra o último valor a partir daqui (sensor_reading_metas).
  const readingDate = new Date('2026-06-01T12:00:00Z');
  const readings = sensors.map((sensor, i) => {
    const recordedAt = new Date(readingDate.getTime() + i * 60 * 1000);
    const value = Math.round(((sensor.min_value + sensor.max_value) / 2) * 100) / 100;
    return {
      sensor_id: sensor.id,
      green_space_id: zoneSpace.get(sensor.green_space_zone_id),
      recorded_at: recordedAt,
      is_valid: true,
      dump: {
        parameter: sensor.parameter,
        value,
        unit: sensor.unit,
        recorded_at: recordedAt.toISOString(),
      },
    };
  });
  await SensorReadingMetas.bulkCreate(readings);

  const alerts = [];
  for (const def of alertDefs) {
    const matched = sensors
      .filter((s) => s.parameter === def.parameter)
      .slice(0, 3);
    for (const sensor of matched) {
      alerts.push({
        sensor_id: sensor.id,
        green_space_id: zoneSpace.get(sensor.green_space_zone_id),
        severity: def.severity,
        message: def.message,
        is_notified: false,
        created_by: admin.id,
      });
    }
  }
  await Alerts.bulkCreate(alerts);

  console.log(
    `[seed:prod] Concluído: ${ROLES.length} perfis, ${STAFF.length} utilizadores, ` +
      `${spaces.length} espaços, ${zones.length} zonas, ${sensors.length} sensores, ` +
      `${readings.length} leituras, ${tasks.length} tarefas, ${reports.length} ocorrências, ${alerts.length} alertas.`,
  );
};

try {
  await main();
} catch (err) {
  // Não bloquear o arranque do servidor por causa do seed de bootstrap.
  console.error('[seed:prod] Falha ao popular a base (ignorada):', err);
} finally {
  await sequelize.close();
}

// Force exit
process.exit(0);
