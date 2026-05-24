import { Router } from 'express';

import SensorsController from '../controllers/sensors.js';
import requireAuth from '../middleware/auth.js';

const sensorsRouter = Router({ mergeParams: true });

sensorsRouter.get('/summary', SensorsController.getSummary);
sensorsRouter.get('/distribution', SensorsController.getDistribution);
sensorsRouter.get('/', SensorsController.getSensors);

sensorsRouter.post('/', requireAuth, SensorsController.createSensor);
sensorsRouter.put('/:sensorId', requireAuth, SensorsController.updateSensor);
sensorsRouter.delete('/:sensorId', requireAuth, SensorsController.deleteSensor);

export default sensorsRouter;
