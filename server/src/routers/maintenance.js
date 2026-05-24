import { Router } from 'express';

import MaintenanceController from '../controllers/maintenance.js';
import requireAuth from '../middleware/auth.js';

const maintenanceRouter = Router({ mergeParams: true });

maintenanceRouter.get('/summary', MaintenanceController.getSummary);

maintenanceRouter.get('/', requireAuth, MaintenanceController.getTasks);
maintenanceRouter.delete('/:maintenanceId', requireAuth, MaintenanceController.deleteTask);

export default maintenanceRouter;
