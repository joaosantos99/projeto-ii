import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { startTestDatabase } from '../helpers/db.js';
import { apiGet, apiPatch, buildApp, close, listen } from '../helpers/app.js';
import { assignRole, createActor, createRole, createSession, createUser, createGreenSpace } from '../helpers/factories.js';

describe('Search green spaces filters and pagination', () => {
    let db, 
        models,
        server,
        baseUrl,
        actorId,
        adminToken;

    beforeAll(async () => {
        db = await startTestDatabase();
        models = db.models;
        
        const app = await buildApp();
        ({ server, baseUrl } = await listen(app));

        // Actor satisfies the self-referencing created_by/updated_by FKs.
        actorId = await createActor(models);

        // Admin can read + update roles; used to drive permission toggles over HTTP.
        const adminRole = await createRole(models, {
        name: 'admin',
        permissions: ['spaces:read', 'spaces:update'],
        actorId,
        });

        const user = await createUser(models, { roleId: adminRole.id, actorId });
        adminToken = await createSession(models, { userId: user.id });

        await createGreenSpace(models, { name: 'Jardim da Estrela', parish: 'Lisboa', actorId });
        await createGreenSpace(models, { name: 'Parque da Cidade', parish: 'Porto', actorId });
        await createGreenSpace(models, { name: 'Jardim do Morro', parish: 'Porto', actorId });
        await createGreenSpace(models, { name: 'Parque das Nações', parish: 'Lisboa', actorId });
        await createGreenSpace(models, { name: 'Jardim do Palácio', parish: 'Sintra', actorId });
    }, 120_000)

    it('returns paginated spaces with correct structure', async () => {
        // GIVEN - page 1 with 2 results per page
        // WHEN
        const res = await apiGet(baseUrl, '/api/spaces?page=1&perPage=2', adminToken);

        // THEN 
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.spaces).toHaveLength(2);
        expect(body.pagination.totalPages).toBeGreaterThanOrEqual(3);
    })

    it('filters spaces by parish', async () => {
        // GIVEN - filtro por cidade Porto
        // WHEN
        const res = await apiGet(baseUrl, '/api/spaces?parish=Porto', adminToken);

        // THEN
        expect(res.status).toBe(200);
        const { spaces } = await res.json();
        expect(spaces.length).toBeGreaterThanOrEqual(2);
        expect(spaces.every((s) => s.parish === 'Porto')).toBe(true);
    })

    it('filters spaces by query', async () => {
        // GIVEN - filtro por nome Jardim
        // WHEN
        const res = await apiGet(baseUrl, '/api/spaces?query=Jardim', adminToken);

        // THEN
        expect(res.status).toBe(200);
        const { spaces } = await res.json();
        expect(spaces.length).toBeGreaterThanOrEqual(2);
        expect(spaces.every((s) => s.name.includes('Jardim'))).toBe(true);
    })

    it('filters spaces by query and parish', async () => {
        // GIVEN - filtro por nome Jardim e cidade do Porto
        // WHEN
        const res = await apiGet(baseUrl, '/api/spaces?query=Jardim&parish=Porto', adminToken);

        // THEN
        expect(res.status).toBe(200);
        const { spaces } = await res.json();
        expect(spaces.length).toBeGreaterThanOrEqual(1);
        expect(spaces.every((s) => s.name.includes('Jardim') && s.parish === 'Porto')).toBe(true);
    })

    afterAll(async () => {
        if (server) await close(server);
        if (db) await db.stop();
    })
})