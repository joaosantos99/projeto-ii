import { Router } from 'express';

import SensorsController from '../controllers/sensors.js';

const sensorsRouter = Router({ mergeParams: true });

sensorsRouter.get('/summary', SensorsController.getSpacesSummary);
sensorsRouter.put('/:sensorId', SensorsController.updateSensor);
sensorsRouter.delete('/:sensorId', SensorsController.deleteSensor);

export default sensorsRouter;
