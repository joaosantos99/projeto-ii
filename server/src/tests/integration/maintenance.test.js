import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import crypto from 'node:crypto';

import { startTestDatabase } from '../helpers/db.js';
import { apiGet, apiPost, apiPatch, buildApp, close, listen } from '../helpers/app.js';
import { createActor, createRole, createSession, createUser } from '../helpers/factories.js';

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

async function scheduleTask(baseUrl, token, overrides = {}) {
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString();
  const payload = {
    type: 'poda',
    description: 'Poda de arbustos na zona norte',
    status: 'scheduled',
    scheduled_date: tomorrow,
    ...overrides,
  };
  return apiPost(baseUrl, '/api/maintenance', token, payload);
}

describe('Manutenção — agendamento e histórico de intervenções', () => {
  let db;
  let models;
  let server;
  let baseUrl;
  let actorId;
  let adminToken;
  let adminUser;
  let spaceId;

  beforeAll(async () => {
    db = await startTestDatabase();
    models = db.models;

    const app = await buildApp();
    ({ server, baseUrl } = await listen(app));


    actorId = await createActor(models);

    // Admin role (maintenance endpoints only require auth, not a specific
    // permission, so any authenticated role is sufficient).
    const adminRole = await createRole(models, {
      name: 'admin',
      permissions: ['spaces:read'],
      actorId,
    });
    adminUser = await createUser(models, { roleId: adminRole.id, actorId });
    adminToken = await createSession(models, { userId: adminUser.id });

    // A green space whose id can be used as FK for maintenance tasks.
    const space = await createGreenSpace(models, actorId);
    spaceId = space.id;
  }, 120_000);

  afterAll(async () => {
    if (server) await close(server);
    if (db) await db.stop();
  });


  // Agendamento via API
  describe('agendamento de tarefa de manutenção via API', () => {
    it('cria uma tarefa com status "scheduled" e devolve 201 com os dados corretos', async () => {
      // GIVEN — um utilizador autenticado e um payload de agendamento válido
      const scheduledDate = new Date(Date.now() + 2 * 86_400_000).toISOString();

      // WHEN — o utilizador envia POST /api/maintenance
      const res = await scheduleTask(baseUrl, adminToken, {
        green_spaces_id: spaceId,
        type: 'rega',
        description: 'Rega automática do relvado principal',
        scheduled_date: scheduledDate,
      });

      // THEN — a API devolve 201 e persiste os dados
      expect(res.status).toBe(201);
      const { data } = await res.json();

      expect(data.id).toBeTruthy();
      expect(data.type).toBe('rega');
      expect(data.description).toBe('Rega automática do relvado principal');
      expect(data.status).toBe('scheduled');
      expect(new Date(data.scheduledDate).toISOString()).toBe(new Date(scheduledDate).toISOString());
      expect(data.completedAt).toBeNull();
    });

    it('rejeita a criação sem o campo "type" obrigatório (400)', async () => {
      // GIVEN — payload sem o campo "type"
      const payload = {
        green_spaces_id: spaceId,
        description: 'Descrição sem tipo',
        status: 'scheduled',
        scheduled_date: new Date(Date.now() + 86_400_000).toISOString(),
      };

      // WHEN — o utilizador envia o payload incompleto
      const res = await apiPost(baseUrl, '/api/maintenance', adminToken, payload);

      // THEN — a API devolve 400 com detalhe do campo em falta
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.errors).toHaveProperty('type');
    });

    it('rejeita a criação sem o campo "description" obrigatório (400)', async () => {
      // GIVEN — payload sem o campo "description"
      const payload = {
        green_spaces_id: spaceId,
        type: 'poda',
        status: 'scheduled',
        scheduled_date: new Date(Date.now() + 86_400_000).toISOString(),
      };

      // WHEN
      const res = await apiPost(baseUrl, '/api/maintenance', adminToken, payload);

      // THEN
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.errors).toHaveProperty('description');
    });

    it('rejeita o agendamento quando o token de autenticação está ausente (401)', async () => {
      // GIVEN — pedido sem token
      // WHEN
      const res = await scheduleTask(baseUrl, null, { green_spaces_id: spaceId });

      // THEN
      expect(res.status).toBe(401);
    });

    it('associa o utilizador autenticado como "created_by" da tarefa', async () => {
      // GIVEN — utilizador autenticado com identidade conhecida
      const scheduledDate = new Date(Date.now() + 3 * 86_400_000).toISOString();

      // WHEN
      const res = await scheduleTask(baseUrl, adminToken, {
        green_spaces_id: spaceId,
        scheduled_date: scheduledDate,
      });
      expect(res.status).toBe(201);
      const { data } = await res.json();

      // THEN — o registo na base de dados tem o created_by correto
      const task = await models.MaintenanceTasks.findByPk(data.id);
      expect(task.created_by).toBe(adminUser.id);
    });
  });


  // Histórico de intervenções com data, tipo e utilizador
  describe('histórico de intervenções com data, tipo e utilizador', () => {
    it('lista as tarefas concluídas com data de conclusão, tipo e referência ao utilizador', async () => {
      // GIVEN — uma tarefa previamente agendada
      const createRes = await scheduleTask(baseUrl, adminToken, {
        green_spaces_id: spaceId,
        type: 'limpeza',
        description: 'Limpeza geral da área de lazer',
      });
      expect(createRes.status).toBe(201);
      const { data: created } = await createRes.json();

      // AND — marcada como concluída via PATCH
      const patchRes = await apiPatch(baseUrl, `/api/maintenance/${created.id}`, adminToken, {
        status: 'completed',
      });
      expect(patchRes.status).toBe(200);

      // WHEN — o histórico de tarefas concluídas é consultado com filtro de status
      const listRes = await apiGet(baseUrl, '/api/maintenance?status=completed', adminToken);
      expect(listRes.status).toBe(200);
      const { data: tasks } = await listRes.json();

      // THEN — a tarefa concluída está presente na listagem
      const found = tasks.find((t) => t.id === created.id);
      expect(found).toBeDefined();

      // AND — inclui os campos essenciais do histórico
      expect(found.type).toBe('limpeza');
      expect(found.status).toBe('completed');
      expect(found.completedAt).not.toBeNull();
      expect(new Date(found.completedAt).getTime()).toBeGreaterThan(0);
      expect(new Date(found.scheduledDate).getTime()).toBeGreaterThan(0);
    });

    it('preenche completedAt automaticamente ao transitar para "completed"', async () => {
      // GIVEN — uma tarefa agendada
      const before = new Date();
      const createRes = await scheduleTask(baseUrl, adminToken, {
        green_spaces_id: spaceId,
        type: 'irrigação',
        description: 'Verificação do sistema de irrigação',
      });
      expect(createRes.status).toBe(201);
      const { data: created } = await createRes.json();
      expect(created.completedAt).toBeNull();

      // WHEN — a tarefa é marcada como concluída
      const patchRes = await apiPatch(baseUrl, `/api/maintenance/${created.id}`, adminToken, {
        status: 'completed',
      });
      expect(patchRes.status).toBe(200);
      const { data: patched } = await patchRes.json();

      // THEN — completedAt é preenchido e posterior ao momento anterior ao PATCH
      expect(patched.completedAt).not.toBeNull();
      expect(new Date(patched.completedAt).getTime()).toBeGreaterThanOrEqual(before.getTime());
    });

    it('regista o utilizador que criou a tarefa e pode ser obtido por id', async () => {
      // GIVEN — uma segunda conta de utilizador distinta
      const otherRole = await createRole(models, {
        name: `tecnico-${Date.now()}`,
        permissions: [],
        actorId,
      });
      const otherUser = await createUser(models, { roleId: otherRole.id, actorId });
      const otherToken = await createSession(models, { userId: otherUser.id });

      // WHEN — esse utilizador cria uma tarefa
      const createRes = await scheduleTask(baseUrl, otherToken, {
        green_spaces_id: spaceId,
        type: 'fertilização',
        description: 'Aplicação de fertilizante no relvado',
      });
      expect(createRes.status).toBe(201);
      const { data: created } = await createRes.json();

      // THEN — o registo persiste o id correto em created_by
      const task = await models.MaintenanceTasks.findByPk(created.id);
      expect(task.created_by).toBe(otherUser.id);

      // AND — o utilizador pode ser obtido por associação
      const taskWithUser = await models.MaintenanceTasks.findByPk(created.id, {
        include: [{ model: models.Users, as: 'createdBy', attributes: ['id', 'full_name', 'email'] }],
      });
      expect(taskWithUser.createdBy.id).toBe(otherUser.id);
    });

    it('retorna tarefas ordenadas por data de agendamento ascendente', async () => {
      // GIVEN — três tarefas criadas em datas futuras diferentes
      const dates = [
        new Date(Date.now() + 10 * 86_400_000).toISOString(),
        new Date(Date.now() + 5 * 86_400_000).toISOString(),
        new Date(Date.now() + 15 * 86_400_000).toISOString(),
      ];

      for (const scheduled_date of dates) {
        const res = await scheduleTask(baseUrl, adminToken, {
          green_spaces_id: spaceId,
          scheduled_date,
        });
        expect(res.status).toBe(201);
      }

      // WHEN — a listagem global é consultada
      const listRes = await apiGet(baseUrl, '/api/maintenance', adminToken);
      expect(listRes.status).toBe(200);
      const { data: tasks } = await listRes.json();

      // THEN — as datas de agendamento estão em ordem crescente
      const scheduledDates = tasks.map((t) => new Date(t.scheduledDate).getTime());
      for (let i = 1; i < scheduledDates.length; i++) {
        expect(scheduledDates[i]).toBeGreaterThanOrEqual(scheduledDates[i - 1]);
      }
    });
  });
});