import { Router } from 'express';

import AlertController from '../controllers/alerts.js';
import requireAuth from '../middleware/auth.js';

const alertRouter = Router({ mergeParams: true });

alertRouter.get('/', requireAuth, AlertController.getAlerts);
alertRouter.patch('/:incidentId', requireAuth, AlertController.updateAlert);

export default alertRouter;