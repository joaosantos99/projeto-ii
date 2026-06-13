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

describe('Normalização de dados para o sistema métrico (persistência no servidor)', () => {
  let db;
  let models;
  let SensorsService;
  let actorId;
  let spaceId;
  let zoneId;

  beforeAll(async () => {
    db = await startTestDatabase();
    models = db.models;
    // Importado após startTestDatabase para usar a connection do contentor.
    SensorsService = (await import('../../services/sensors.js')).default;

    actorId = await createActor(models);
    const space = await createGreenSpace(models, actorId);
    spaceId = space.id;
    const zone = await createZone(models, { spaceId, actorId });
    zoneId = zone.id;
  }, 120_000);

  afterAll(async () => {
    if (db) await db.stop();
  });

  function sensorData(overrides = {}) {
    return {
      green_space_zone_id: zoneId,
      type: 'temperature',
      parameter: 'temperatura',
      unit: '°C',
      min_value: 0,
      max_value: 40,
      is_active: true,
      created_by: actorId,
      updated_by: actorId,
      ...overrides,
    };
  }

  // Criação: valores convertidos para a unidade canónica antes de persistir
  describe('criação de sensor converte para a unidade canónica', () => {
    it('converte limites de Fahrenheit para Celsius e guarda °C', async () => {
      // GIVEN — um sensor de temperatura com limites em Fahrenheit
      const data = sensorData({ unit: 'F', min_value: 32, max_value: 212 });

      // WHEN — o sensor é criado e relido da BD
      const created = await SensorsService.createSensor(data);
      const fromDb = await models.Sensors.findByPk(created.id);

      // THEN — a unidade fica canónica e os limites em Celsius
      expect(fromDb.unit).toBe('°C');
      expect(fromDb.min_value).toBe(0);
      expect(fromDb.max_value).toBe(100);
    });

    it('converte Kelvin para Celsius', async () => {
      // GIVEN — limites em Kelvin
      const data = sensorData({ unit: 'kelvin', min_value: 273.15, max_value: 300 });

      // WHEN
      const created = await SensorsService.createSensor(data);
      const fromDb = await models.Sensors.findByPk(created.id);

      // THEN
      expect(fromDb.unit).toBe('°C');
      expect(fromDb.min_value).toBe(0);
      expect(fromDb.max_value).toBe(26.85);
    });

    it('converte foot-candles para lux num sensor de luz', async () => {
      // GIVEN — sensor de luz com limites em foot-candles
      const data = sensorData({
        type: 'light',
        parameter: 'luminosidade',
        unit: 'fc',
        min_value: 0,
        max_value: 100,
      });

      // WHEN
      const created = await SensorsService.createSensor(data);
      const fromDb = await models.Sensors.findByPk(created.id);

      // THEN — guarda em lux (100 fc ≈ 1076.391 lux; coluna FLOAT, daí toBeCloseTo)
      expect(fromDb.unit).toBe('lux');
      expect(fromDb.min_value).toBe(0);
      expect(fromDb.max_value).toBeCloseTo(1076.391, 1);
    });

    it('assume a unidade canónica quando nenhuma é fornecida (sem conversão)', async () => {
      // GIVEN — sensor de humidade sem unidade explícita
      const data = sensorData({ type: 'humidity', parameter: 'humidade', unit: undefined, min_value: 20, max_value: 80 });

      // WHEN
      const created = await SensorsService.createSensor(data);
      const fromDb = await models.Sensors.findByPk(created.id);

      // THEN — valores inalterados, unidade '%'
      expect(fromDb.unit).toBe('%');
      expect(fromDb.min_value).toBe(20);
      expect(fromDb.max_value).toBe(80);
    });

    it('aceita alias com espaços e maiúsculas (case/whitespace-insensitive)', async () => {
      // GIVEN — unidade com ruído de formatação
      const data = sensorData({ unit: '  FaHrEnHeIt  ', min_value: 32, max_value: 32 });

      // WHEN
      const created = await SensorsService.createSensor(data);
      const fromDb = await models.Sensors.findByPk(created.id);

      // THEN
      expect(fromDb.unit).toBe('°C');
      expect(fromDb.min_value).toBe(0);
    });
  });

  // Criação via assinatura aninhada (spaceId, data) — valida tipo e normaliza
  describe('criação aninhada sob um espaço normaliza e valida', () => {
    it('converte para canónico ao criar com (spaceId, data)', async () => {
      // GIVEN — payload com unidade imperial sob um espaço existente
      const data = {
        green_space_zone_id: zoneId,
        type: 'temperature',
        parameter: 'temperatura',
        unit: 'fahrenheit',
        min_value: 50,
        max_value: 86,
        created_by: actorId,
      };

      // WHEN
      const created = await SensorsService.createSensor(spaceId, data);
      const fromDb = await models.Sensors.findByPk(created.id);

      // THEN — 50°F=10°C, 86°F=30°C
      expect(fromDb.unit).toBe('°C');
      expect(fromDb.min_value).toBe(10);
      expect(fromDb.max_value).toBe(30);
    });

    it('rejeita um tipo de sensor inválido (400)', async () => {
      // GIVEN — tipo desconhecido
      const data = { green_space_zone_id: zoneId, type: 'pressure', created_by: actorId };

      // WHEN/THEN
      await expect(SensorsService.createSensor(spaceId, data)).rejects.toMatchObject({ statusCode: 400 });
    });

    it('rejeita quando o espaço não existe (404)', async () => {
      // GIVEN — spaceId inexistente
      const data = { green_space_zone_id: zoneId, type: 'temperature', created_by: actorId };

      // WHEN/THEN
      await expect(SensorsService.createSensor(crypto.randomUUID(), data)).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // Atualização: reconverte para canónico
  describe('atualização de sensor reconverte para a unidade canónica', () => {
    it('converte novos limites em Fahrenheit ao atualizar', async () => {
      // GIVEN — um sensor já em °C
      const created = await SensorsService.createSensor(sensorData({ unit: '°C', min_value: 5, max_value: 35 }));

      // WHEN — atualizado com limites em Fahrenheit
      const updated = await SensorsService.updateSensor(created.id, {
        unit: 'F',
        min_value: 32,
        max_value: 212,
        updated_by: actorId,
      });
      const fromDb = await models.Sensors.findByPk(updated.id);

      // THEN — guarda canónico em Celsius
      expect(fromDb.unit).toBe('°C');
      expect(fromDb.min_value).toBe(0);
      expect(fromDb.max_value).toBe(100);
    });

    it('rejeita atualização para um tipo inválido (400)', async () => {
      // GIVEN — sensor existente
      const created = await SensorsService.createSensor(sensorData());

      // WHEN/THEN
      await expect(
        SensorsService.updateSensor(created.id, { type: 'pressure', updated_by: actorId }),
      ).rejects.toMatchObject({ statusCode: 400 });
    });
  });
});
