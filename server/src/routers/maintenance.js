import { Router } from 'express';

import MaintenanceController from '../controllers/maintenance.js';

const maintenanceRouter = Router({ mergeParams: true });

maintenanceRouter.get('/', MaintenanceController.getTasks);
maintenanceRouter.delete('/:maintenanceId', MaintenanceController.deleteTask);

export default maintenanceRouter;