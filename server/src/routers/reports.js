import { Router } from 'express';

import ReportsController from '../controllers/reports.js';
import requireAuth from '../middleware/auth.js';
import requirePermission from '../middleware/requirePermission.js';

const reportsRouter = Router({ mergeParams: true });

reportsRouter.get('/', requireAuth, requirePermission('reports:read'), ReportsController.getReports);
reportsRouter.get('/summary', requireAuth, requirePermission('reports:read'), ReportsController.getSummary);
reportsRouter.get('/distribution', requireAuth, requirePermission('reports:read'), ReportsController.getDistribution);
reportsRouter.post('/generate', requireAuth, requirePermission('reports:create'), ReportsController.generateReport);
reportsRouter.get('/:reportId/export', requireAuth, requirePermission('reports:read'), ReportsController.exportReport);

reportsRouter.post('/:spaceId/incident', ReportsController.createIncident);
reportsRouter.post('/:spaceId/comment', ReportsController.createComment);

export default reportsRouter;
