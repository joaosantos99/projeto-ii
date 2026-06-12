import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { startTestDatabase } from '../helpers/db.js';
import { apiPost, buildApp, close, listen } from '../helpers/app.js';
import { createActor, createRole, createSession, createUser, createGreenSpace } from '../helpers/factories.js';

describe('Incident and comment report submission', () => {
    let db, 
        models,
        server,
        baseUrl,
        actorId,
        adminToken,
        spaceId;

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

        const space = await createGreenSpace(models, { name: 'Jardim Teste', parish: 'Lisboa', actorId });
        spaceId = space.id;

    }, 120_000);

    afterAll(async () => {
        if (server) await close(server);
        if (db) await db.stop();
    });

    it('creates an incident successfully', async () => {
        // GIVEN - a valid incident payload for an existing space
        // WHEN - the report endpoint is called without authentication
        const res = await apiPost(baseUrl, '/api/reports', null, {
            spaceId,
            type: 'incident',
            description: 'Árvore caída no caminho principal'
        });

        // THEN - the incident is created and returned
        expect(res.status).toBe(201);
        const body = await res.json();
        expect(body.data.type).toBe('incident');
        expect(body.data.description).toBe('Árvore caída no caminho principal');
    });

    it('returns 400 when description is missing', async () => {
        // GIVEN - an incident payload missing the description field
        // WHEN - the report endpoint is called
        const res = await apiPost(baseUrl, '/api/reports', null, {
            spaceId,
            type: 'incident',
        });

        // THEN - the request is rejected as bad request
        expect(res.status).toBe(400);
    });

    it('returns 400 when type is invalid', async () => {
        // GIVEN - a payload with an unrecognised type value
        // WHEN - the report endpoint is called
        const res = await apiPost(baseUrl, '/api/reports', null, {
            spaceId,
            type: 'invalid',
            description: 'Teste',
        });

        // THEN - the request is rejected as bad request
        expect(res.status).toBe(400);
    });

    it('returns 404 when space does not exist', async () => {
        // GIVEN - a spaceId that does not correspond to any existing space
        // WHEN - the report endpoint is called
        const res = await apiPost(baseUrl, '/api/reports', null, {
            spaceId: '00000000-0000-0000-0000-000000000000',
            type: 'incident',
            description: 'Teste',
        });
        
        // THEN - the request is rejected as not found
        expect(res.status).toBe(404);
    });

    it('creates a comment successfully', async () => {
        // GIVEN - a valid comment payload for an existing space
        // WHEN - the report endpoint is called without authentication
        const res = await apiPost(baseUrl, '/api/reports', null, {
            spaceId,
            type: 'comment',
            description: 'Este parque está muito bem cuidado!',
        });

        // THEN - the comment is created and returned
        expect(res.status).toBe(201);
        const body = await res.json();
        expect(body.data.type).toBe('comment');
        expect(body.data.description).toBe('Este parque está muito bem cuidado!');
    });

    it('returns 400 when description is missing for comment', async () => {
        // GIVEN - a comment payload missing the description field
        // WHEN - the report endpoint is called
        const res = await apiPost(baseUrl, '/api/reports', null, {
            spaceId,
            type: 'comment',
        });

        // THEN - the request is rejected as bad request
        expect(res.status).toBe(400);
    });
})