import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { startTestDatabase } from '../helpers/db.js';
import { apiGet, apiPatch, buildApp, close, listen } from '../helpers/app.js';
import { createActor, createRole, createSession, createUser, createGreenSpace, createSensor, createZone, createAlert } from '../helpers/factories.js';

describe('Alert management', () => {
    let db, 
        models,
        server,
        baseUrl,
        actorId,
        adminToken,
        spaceId,
        sensorId,
        alertId;

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
            permissions: ['alerts:read', 'alerts:update'],
            actorId,
        });

        const user = await createUser(models, { roleId: adminRole.id, actorId });
        adminToken = await createSession(models, { userId: user.id });

        const space = await createGreenSpace(models, { name: 'Jardim Teste', parish: 'Lisboa', actorId });
        spaceId = space.id;

        const zone = await createZone(models, { spaceId, actorId });
        const sensor = await createSensor(models, { zoneId: zone.id, actorId });
        sensorId = sensor.id;

        const alert = await createAlert(models, { spaceId, sensorId, actorId });
        alertId = alert.id;    
    }, 120_000);

    afterAll(async () => {
        if (server) await close(server);
        if (db) await db.stop();
    });

    it('returns paginated alerts', async () => {
        // GIVEN - an admin with alerts:read permission
        // WHEN - the alerts endpoint is fetched
        const res = await apiGet(baseUrl, '/api/alerts', adminToken);
        expect(res.status).toBe(200);

        // THEN - returns paginated data with at least one alert
        const body = await res.json();
        expect(body.data.length).toBeGreaterThanOrEqual(1);
        expect(body.meta).toBeDefined();
    });

    it('returns alerts summary', async () => {
        // GIVEN - an admin with alerts:read permission
        // WHEN - the alerts endpoint is fetched with summary=true
        const res = await apiGet(baseUrl, '/api/alerts?summary=true', adminToken);
        expect(res.status).toBe(200);

        // THEN - the summary is present with a total count
        const body = await res.json();
        expect(body.summary).toBeDefined();
        expect(body.summary.totalAlerts).toBeGreaterThanOrEqual(1);
    });

    it('acknowledges an alert', async () => {
        // GIVEN - an existing unacknowledged alert
        // WHEN - the alert is patched with acknowledged: true
        const res = await apiPatch(baseUrl, `/api/alerts/${alertId}`, adminToken, { acknowledged: true });
        expect(res.status).toBe(200);

        // THEN - the alert is marked as notified
        const body = await res.json();
        expect(body.data.isNotified).toBe(true);
    });

    it('returns 400 when no fields provided for update', async () => {
        // GIVEN - an existing alert
        // WHEN - a patch is sent with an empty body
        const res = await apiPatch(baseUrl, `/api/alerts/${alertId}`, adminToken, {});

        // THEN - the request is rejected as bad request
        expect(res.status).toBe(400);
    });

})