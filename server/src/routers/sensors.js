import { Router } from 'express';

import SensorsController from '../controllers/sensors.js';

const sensorsRouter = Router();

// GET /api/sensors/summary
sensorsRouter.get('/summary', SensorsController.getSummary);

// GET /api/sensors/distribution
sensorsRouter.get('/distribution', SensorsController.getDistribution);

// GET /api/sensors?page=&limit=&sort=
sensorsRouter.get('/', SensorsController.getSensors);

export default sensorsRouter;