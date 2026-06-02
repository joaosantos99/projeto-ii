import { Router } from 'express';

import AlertsController from '../controllers/alerts.js';
import requireAuth from '../middleware/auth.js';

const alertsRouter = Router({ mergeParams: true });

alertsRouter.patch('/:alertId/acknowledge', AlertsController.acknowledgeAlert);

alertsRouter.get('/', requireAuth, AlertsController.getAlerts);
alertsRouter.patch('/:incidentId', requireAuth, AlertsController.updateAlert);

export default alertsRouter;
