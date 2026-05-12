import { Router } from 'express';

import ReportsController from '../controllers/reports.js';
import requireAuth from '../middleware/auth.js';
import requirePermission from '../middleware/requirePermission.js';

const reportsRouter = Router();

reportsRouter.get('/summary', requireAuth, requirePermission('reports:read'), ReportsController.getSummary);
reportsRouter.get('/distribution', requireAuth, requirePermission('reports:read'), ReportsController.getDistribution);

export default reportsRouter;
