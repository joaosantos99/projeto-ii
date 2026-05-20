import { Router } from 'express';

import AlertsController from '../controllers/alerts.js';

const alertsRouter = Router();

// GET /api/alerts/summary
alertsRouter.get('/summary', AlertsController.getSummary);

// PATCH /api/alerts/:alertId/acknowledge
alertsRouter.patch('/:alertId/acknowledge', AlertsController.acknowledgeAlert);

export default alertsRouter;