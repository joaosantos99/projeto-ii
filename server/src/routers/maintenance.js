import { Router } from 'express';

import MaintenanceController from '../controllers/maintenance.js';
import requireAuth from '../middleware/auth.js';

const maintenanceRouter = Router({ mergeParams: true });

maintenanceRouter.get('/', requireAuth, MaintenanceController.getTasks);
maintenanceRouter.post('/', requireAuth, MaintenanceController.createTask);
maintenanceRouter.patch('/:taskId/status', requireAuth, MaintenanceController.updateTaskStatus);
maintenanceRouter.put('/:taskId', requireAuth, MaintenanceController.updateTask);
maintenanceRouter.delete('/:maintenanceId', requireAuth, MaintenanceController.deleteTask);

export default maintenanceRouter;
