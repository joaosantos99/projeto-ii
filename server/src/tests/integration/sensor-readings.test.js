import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import crypto from 'node:crypto';

import { startTestDatabase } from '../helpers/db.js';
import { createActor } from '../helpers/factories.js';

async function createGreenSpace(models, actorId) {
  return models.GreenSpaces.create({
    name: `Espaço-${crypto.randomUUID()}`,
    parish: 'Cedofeita',
    postal_code: '4050-001',
    latitude: 41.15,
    longitude: -8.61,
    created_by: actorId,
    updated_by: actorId,
  });
}

async function createZone(models, { spaceId, actorId }) {
  return models.GreenSpaceZones.create({
    green_spaces_id: spaceId,
    name: `Zona-${crypto.randomUUID()}`,
    created_by: actorId,
    updated_by: actorId,
  });
}

async function createSensor(models, { zoneId, actorId, overrides = {} }) {
  return models.Sensors.create({
    green_space_zone_id: zoneId,
    type: 'temperature',
    parameter: 'temperatura',
    unit: '°C',
    min_value: -10,
    max_value: 50,
    is_active: true,
    created_by: actorId,
    updated_by: actorId,
    ...overrides,
  });
}

function buildReading({ sensorId, spaceId, overrides = {} }) {
  const recordedAt = new Date();
  return {
    sensor_id: sensorId,
    green_space_id: spaceId,
    recorded_at: recordedAt,
    is_valid: true,
    dump: {
      parameter: 'temperatura',
      value: 21.5,
      unit: '°C',
      recorded_at: recordedAt.toISOString(),
    },
    ...overrides,
  };
}

describe('Registo de valores de sensores na base de dados', () => {
  let db;
  let models;
  let actorId;
  let spaceId;
  let sensor;

  beforeAll(async () => {
    db = await startTestDatabase();
    models = db.models;

    actorId = await createActor(models);
    const space = await createGreenSpace(models, actorId);
    spaceId = space.id;
    const zone = await createZone(models, { spaceId, actorId });
    sensor = await createSensor(models, { zoneId: zone.id, actorId });
  }, 120_000);

  afterAll(async () => {
    if (db) await db.stop();
  });

  // Persistência de uma leitura válida
  describe('persistência de uma leitura de sensor', () => {
    it('grava uma leitura com todos os campos e devolve-a com id gerado', async () => {
      // GIVEN — uma leitura válida associada a um sensor e espaço existentes
      const reading = buildReading({ sensorId: sensor.id, spaceId });

      // WHEN — a leitura é registada na BD
      const created = await models.SensorReadingMetas.create(reading);

      // THEN — recebe um id e persiste os campos essenciais
      expect(created.id).toBeTruthy();
      expect(created.sensor_id).toBe(sensor.id);
      expect(created.green_space_id).toBe(spaceId);
      expect(created.is_valid).toBe(true);
      expect(new Date(created.recorded_at).getTime()).toBeGreaterThan(0);
    });

    it('preserva o payload bruto (dump) em JSON ao reler da BD', async () => {
      // GIVEN — uma leitura com payload bruto value/unit/parameter
      const reading = buildReading({
        sensorId: sensor.id,
        spaceId,
        overrides: { dump: { parameter: 'temperatura', value: 33.7, unit: '°C' } },
      });

      // WHEN — grava e relê da BD por id
      const { id } = await models.SensorReadingMetas.create(reading);
      const fromDb = await models.SensorReadingMetas.findByPk(id);

      // THEN — o JSON faz round-trip sem perda
      expect(fromDb.dump.value).toBe(33.7);
      expect(fromDb.dump.unit).toBe('°C');
      expect(fromDb.dump.parameter).toBe('temperatura');
    });

    it('marca leituras fora de gama como inválidas (is_valid = false)', async () => {
      // GIVEN — uma leitura sinalizada como inválida
      const reading = buildReading({
        sensorId: sensor.id,
        spaceId,
        overrides: { is_valid: false, dump: { value: 999, unit: '°C' } },
      });

      // WHEN — é registada
      const { id } = await models.SensorReadingMetas.create(reading);
      const fromDb = await models.SensorReadingMetas.findByPk(id);

      // THEN — persiste o flag de invalidez
      expect(fromDb.is_valid).toBe(false);
    });

    it('aceita uma leitura sem dump (coluna anulável)', async () => {
      // GIVEN — uma leitura sem payload bruto
      const reading = buildReading({ sensorId: sensor.id, spaceId, overrides: { dump: null } });

      // WHEN
      const created = await models.SensorReadingMetas.create(reading);

      // THEN — persiste com dump nulo
      expect(created.id).toBeTruthy();
      expect(created.dump).toBeNull();
    });
  });

  // Integridade dos dados
  describe('integridade do registo', () => {
    it('rejeita uma leitura sem recorded_at (NOT NULL)', async () => {
      // GIVEN — leitura sem timestamp
      const reading = buildReading({ sensorId: sensor.id, spaceId, overrides: { recorded_at: null } });

      // WHEN/THEN — a gravação falha
      await expect(models.SensorReadingMetas.create(reading)).rejects.toThrow();
    });

    it('rejeita uma leitura sem is_valid (NOT NULL)', async () => {
      // GIVEN — leitura sem flag de validade
      const reading = buildReading({ sensorId: sensor.id, spaceId, overrides: { is_valid: null } });

      // WHEN/THEN
      await expect(models.SensorReadingMetas.create(reading)).rejects.toThrow();
    });

    it('rejeita uma leitura cujo sensor_id não existe (FK)', async () => {
      // GIVEN — leitura a apontar para um sensor inexistente
      const reading = buildReading({ sensorId: crypto.randomUUID(), spaceId });

      // WHEN/THEN — a constraint de chave estrangeira impede o registo
      await expect(models.SensorReadingMetas.create(reading)).rejects.toThrow();
    });

    it('rejeita uma leitura cujo green_space_id não existe (FK)', async () => {
      // GIVEN — leitura a apontar para um espaço inexistente
      const reading = buildReading({ sensorId: sensor.id, spaceId: crypto.randomUUID() });

      // WHEN/THEN
      await expect(models.SensorReadingMetas.create(reading)).rejects.toThrow();
    });
  });

  // Histórico e ordenação por momento de leitura
  describe('histórico de leituras por sensor', () => {
    it('regista múltiplas leituras para o mesmo sensor e devolve a mais recente', async () => {
      // GIVEN — um sensor dedicado com três leituras em momentos distintos
      const zone = await createZone(models, { spaceId, actorId });
      const local = await createSensor(models, { zoneId: zone.id, actorId });

      const base = Date.now();
      const offsets = [0, 60_000, 120_000];
      for (const offset of offsets) {
        const at = new Date(base + offset);
        await models.SensorReadingMetas.create(
          buildReading({
            sensorId: local.id,
            spaceId,
            overrides: { recorded_at: at, dump: { value: offset, unit: '°C' } },
          }),
        );
      }

      // WHEN — consulta as leituras do sensor ordenadas por recorded_at DESC
      const rows = await models.SensorReadingMetas.findAll({
        where: { sensor_id: local.id },
        order: [['recorded_at', 'DESC']],
      });

      // THEN — há três leituras e a primeira é a mais recente
      expect(rows).toHaveLength(3);
      expect(rows[0].dump.value).toBe(120_000);
      expect(new Date(rows[0].recorded_at).getTime()).toBeGreaterThanOrEqual(
        new Date(rows[1].recorded_at).getTime(),
      );
    });
  });
});
