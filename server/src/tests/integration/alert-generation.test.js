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
    type: 'humidity',
    parameter: 'humidade',
    unit: '%',
    min_value: 30,
    max_value: 70,
    is_active: true,
    created_by: actorId,
    updated_by: actorId,
    ...overrides,
  });
}

describe('Geração de alertas por limite de sensor (RF01.3 / TC002)', () => {
  let db;
  let models;
  let AlertsService;
  let actorId;
  let spaceId;
  let sensor;

  beforeAll(async () => {
    db = await startTestDatabase();
    models = db.models;
    AlertsService = (await import('../../services/alerts.js')).default;

    actorId = await createActor(models);
    const space = await createGreenSpace(models, actorId);
    spaceId = space.id;
    const zone = await createZone(models, { spaceId, actorId });
    // Banda [30, 70] — qualquer valor fora desta gama deve disparar alerta.
    sensor = await createSensor(models, { zoneId: zone.id, actorId });
  }, 120_000);

  afterAll(async () => {
    if (db) await db.stop();
  });

  // Disparo: valor fora da gama cria alerta
  describe('valor fora da gama cria um alerta', () => {
    it('cria um alerta quando o valor ultrapassa o máximo', async () => {
      // GIVEN — sensor com máximo 70 e uma leitura de 75
      // WHEN — a leitura é avaliada
      const alert = await AlertsService.evaluateReading({
        sensor,
        value: 75,
        greenSpaceId: spaceId,
        createdBy: actorId,
      });

      // THEN — um alerta é persistido e ligado ao sensor/espaço
      expect(alert).not.toBeNull();
      const fromDb = await models.Alerts.findByPk(alert.id);
      expect(fromDb).not.toBeNull();
      expect(fromDb.sensor_id).toBe(sensor.id);
      expect(fromDb.green_space_id).toBe(spaceId);
      expect(fromDb.is_notified).toBe(false);
      expect(fromDb.created_by).toBe(actorId);
      expect(fromDb.message).toContain('máximo');
    });

    it('cria um alerta quando o valor fica abaixo do mínimo', async () => {
      // GIVEN — mínimo 30, leitura 10
      const alert = await AlertsService.evaluateReading({
        sensor,
        value: 10,
        greenSpaceId: spaceId,
        createdBy: actorId,
      });

      // THEN — alerta criado com mensagem a referir o limite mínimo
      expect(alert).not.toBeNull();
      expect(alert.message).toContain('mínimo');
    });

    it('classifica como "critical" um desvio superior a 20% da banda', async () => {
      // GIVEN — banda [30,70] (largura 40, margem 8); 90 > 70+8
      const alert = await AlertsService.evaluateReading({
        sensor,
        value: 90,
        greenSpaceId: spaceId,
        createdBy: actorId,
      });

      // THEN — severidade crítica
      expect(alert.severity).toBe('critical');
    });

    it('classifica como "high" um desvio dentro de 20% da banda', async () => {
      // GIVEN — 75 está entre 70 e 70+8
      const alert = await AlertsService.evaluateReading({
        sensor,
        value: 75,
        greenSpaceId: spaceId,
        createdBy: actorId,
      });

      // THEN — severidade alta (não crítica)
      expect(alert.severity).toBe('high');
    });

    it('resolve o green_space_id a partir da zona quando não é fornecido', async () => {
      // GIVEN — avaliação sem greenSpaceId explícito
      const alert = await AlertsService.evaluateReading({
        sensor,
        value: 5,
        createdBy: actorId,
      });

      // THEN — o alerta fica ligado ao espaço correto (resolvido pela zona)
      expect(alert.green_space_id).toBe(spaceId);
    });
  });

  // Não-disparo: valor dentro da gama
  describe('valor dentro da gama não cria alerta', () => {
    it('não cria alerta para um valor no meio da banda', async () => {
      // GIVEN — 50 está dentro de [30,70]
      const before = await models.Alerts.count();

      // WHEN
      const alert = await AlertsService.evaluateReading({
        sensor,
        value: 50,
        greenSpaceId: spaceId,
        createdBy: actorId,
      });

      // THEN — devolve null e nenhum alerta é persistido
      expect(alert).toBeNull();
      expect(await models.Alerts.count()).toBe(before);
    });

    it('não cria alerta nos limites exatos (inclusivos)', async () => {
      // GIVEN/WHEN — valores iguais ao mínimo e ao máximo
      const atMin = await AlertsService.evaluateReading({ sensor, value: 30, greenSpaceId: spaceId, createdBy: actorId });
      const atMax = await AlertsService.evaluateReading({ sensor, value: 70, greenSpaceId: spaceId, createdBy: actorId });

      // THEN — ambos dentro da gama
      expect(atMin).toBeNull();
      expect(atMax).toBeNull();
    });
  });

  // Validação e disponibilidade no backoffice
  describe('validação e listagem', () => {
    it('rejeita um valor não numérico (400)', async () => {
      await expect(
        AlertsService.evaluateReading({ sensor, value: 'quente', greenSpaceId: spaceId, createdBy: actorId }),
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('os alertas gerados ficam disponíveis na listagem por espaço', async () => {
      // GIVEN — um sensor/espaço dedicado para isolar a contagem
      const zone = await createZone(models, { spaceId, actorId });
      const local = await createSensor(models, {
        zoneId: zone.id,
        actorId,
        overrides: { min_value: 0, max_value: 100 },
      });
      const space2 = await createGreenSpace(models, actorId);

      // WHEN — uma leitura fora de gama é avaliada para esse espaço
      await AlertsService.evaluateReading({
        sensor: local,
        value: 250,
        greenSpaceId: space2.id,
        createdBy: actorId,
      });

      // THEN — o alerta aparece na listagem do espaço (consulta de backoffice)
      const alerts = await AlertsService.getAlertsBySpace(space2.id);
      expect(alerts).toHaveLength(1);
      expect(alerts[0].sensor_id).toBe(local.id);
    });
  });
});
