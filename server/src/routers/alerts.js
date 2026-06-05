import { Router } from 'express';

import AlertsController from '../controllers/alerts.js';
import requireAuth from '../middleware/auth.js';

const alertsRouter = Router({ mergeParams: true });

alertsRouter.get('/', requireAuth, AlertsController.getAlerts);
alertsRouter.get('/:alertId', requireAuth, AlertsController.getAlertById);
alertsRouter.patch('/:alertId', requireAuth, AlertsController.updateAlert);

export default alertsRouter;
