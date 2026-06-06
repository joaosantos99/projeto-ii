import { Router } from 'express';

import ReportsController from '../controllers/reports.js';
import requireAuth from '../middleware/auth.js';
import requirePermission from '../middleware/requirePermission.js';

const reportsRouter = Router({ mergeParams: true });

reportsRouter.get('/', requireAuth, requirePermission('reports:read'), ReportsController.getReports);
reportsRouter.get('/:reportId', requireAuth, requirePermission('reports:read'), ReportsController.getReportById);
reportsRouter.post('/', ReportsController.createReport);

export default reportsRouter;
