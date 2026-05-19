import { Router } from 'express';

import AlertController from '../controllers/alerts.js';

const alertRouter = Router({ mergeParams: true });

alertRouter.get('/', AlertController.getAlerts);
alertRouter.patch('/:incidentId', AlertController.updateAlert);

export default alertRouter;