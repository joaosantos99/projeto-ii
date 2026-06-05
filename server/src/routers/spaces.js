import { Router } from 'express';

import SpacesController from '../controllers/spaces.js';
import SensorsController from '../controllers/sensors.js';
import ReportsController from '../controllers/reports.js';
import requireAuth from '../middleware/auth.js';
import requirePermission from '../middleware/requirePermission.js';
import uploadImage from '../middleware/upload.js';
import { PERMISSIONS } from '../constants/permissions.js';
import zonesRouter from './zones.js';
import maintenanceRouter from './maintenance.js';
import alertRouter from './alerts.js';

const spacesRouter = Router();

spacesRouter.get('/', SpacesController.getSpaces);
spacesRouter.get('/:spaceId', SpacesController.getSpaceById);
spacesRouter.post('/', requireAuth, requirePermission(PERMISSIONS.SPACES_CREATE), uploadImage, SpacesController.createSpace);
spacesRouter.put('/:spaceId', requireAuth, requirePermission(PERMISSIONS.SPACES_UPDATE), SpacesController.updateSpace);
spacesRouter.use('/:spaceId/zones', zonesRouter);
spacesRouter.get('/:spaceId/sensors', SensorsController.getSensors);
spacesRouter.use('/:spaceId/maintenance', maintenanceRouter);
spacesRouter.use('/:spaceId/alerts', alertRouter);
spacesRouter.post('/:spaceId/reports', ReportsController.createReport);

export default spacesRouter;
