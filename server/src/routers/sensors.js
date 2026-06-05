import { Router } from 'express';

import SensorsController from '../controllers/sensors.js';
import requireAuth from '../middleware/auth.js';

const sensorsRouter = Router({ mergeParams: true });

sensorsRouter.get('/', SensorsController.getSensors);
sensorsRouter.get('/:sensorId', SensorsController.getSensorById);

sensorsRouter.post('/', requireAuth, SensorsController.createSensor);
sensorsRouter.patch('/:sensorId', requireAuth, SensorsController.updateSensor);
sensorsRouter.delete('/:sensorId', requireAuth, SensorsController.deleteSensor);

export default sensorsRouter;
