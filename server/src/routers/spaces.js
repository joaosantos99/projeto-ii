import { Router } from 'express';

import SpacesController from '../controllers/spaces.js';
import requireAuth from '../middleware/auth.js';
import requirePermission from '../middleware/requirePermission.js';
import { PERMISSIONS } from '../constants/permissions.js';
import zonesRouter from './zones.js';
import sensorsRouter from './sensors.js';
import maintenanceRouter from './maintenance.js';
import alertRouter from './alerts.js';
import reportsRouter from './reports.js';

const spacesRouter = Router();

spacesRouter.get('/', requireAuth, requirePermission(PERMISSIONS.SPACES_READ), SpacesController.getSpaces);
spacesRouter.get('/:spaceId', requireAuth, requirePermission(PERMISSIONS.SPACES_READ), SpacesController.getSpaceById);
spacesRouter.post('/', requireAuth, requirePermission(PERMISSIONS.SPACES_CREATE), SpacesController.createSpace);
spacesRouter.put('/:spaceId', requireAuth, requirePermission(PERMISSIONS.SPACES_UPDATE), SpacesController.updateSpace);
spacesRouter.use('/:spaceId/zones', zonesRouter);
spacesRouter.use('/:spaceId/sensors', sensorsRouter);
spacesRouter.use('/:spaceId/maintenance', maintenanceRouter);
spacesRouter.use('/:spaceId/incidents', alertRouter);
spacesRouter.use('/:spaceId/comments', reportsRouter);

export default spacesRouter;
