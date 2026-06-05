import { Router } from 'express';

import MaintenanceController from '../controllers/maintenance.js';
import requireAuth from '../middleware/auth.js';

const maintenanceRouter = Router({ mergeParams: true });

maintenanceRouter.get('/', requireAuth, MaintenanceController.getTasks);
maintenanceRouter.post('/', requireAuth, MaintenanceController.createTask);
maintenanceRouter.get('/:maintenanceId', requireAuth, MaintenanceController.getTaskById);
maintenanceRouter.put('/:maintenanceId', requireAuth, MaintenanceController.updateTask);
maintenanceRouter.patch('/:maintenanceId', requireAuth, MaintenanceController.patchTask);
maintenanceRouter.delete('/:maintenanceId', requireAuth, MaintenanceController.deleteTask);

export default maintenanceRouter;
