import { Router } from 'express';

import SpacesController from '../controllers/spaces.js';
import zonesRouter from './zones.js';
import sensorsRouter from './sensors.js';
import maintenanceRouter from './maintenance.js';
import alertRouter from './alerts.js';
import reportsRouter from './reports.js';

const spacesRouter = Router();

spacesRouter.get('/summary', SpacesController.getSpacesSummary);
spacesRouter.get('/', SpacesController.getSpaces);
spacesRouter.get('/:spaceId', SpacesController.getSpaceById);
spacesRouter.post('/', SpacesController.createSpace);
spacesRouter.put('/:spaceId', SpacesController.updateSpace);
spacesRouter.use('/:spaceId/zones', zonesRouter);
spacesRouter.use('/:spaceId/sensors', sensorsRouter);
spacesRouter.use('/:spaceId/maintenance', maintenanceRouter);
spacesRouter.use('/:spaceId/incidents', alertRouter);
spacesRouter.use('/:spaceId/comments', reportsRouter);

export default spacesRouter;