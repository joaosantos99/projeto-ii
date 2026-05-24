import { Router } from 'express';

import DashboardController from '../controllers/dashboard.js';

const dashboardRouter = Router();

// GET /api/dashboard/summary
dashboardRouter.get('/summary', DashboardController.getSummary);

export default dashboardRouter;
