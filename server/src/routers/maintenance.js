import { Router } from 'express';

import MaintenanceController from '../controllers/maintenance.js';

const maintenanceRouter = Router();

// GET /api/maintenance/summary
maintenanceRouter.get('/summary', MaintenanceController.getSummary);

export default maintenanceRouter;