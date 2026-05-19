import { Router } from 'express';

import ReportController from '../controllers/reports.js';

const reportsRouter = Router({ mergeParams: true });

reportsRouter.get('/', ReportController.getReports);
reportsRouter.delete('/:commentId', ReportController.deleteReport);

export default reportsRouter;