import { Router } from 'express';

import ZonesController from '../controllers/zones.js';
import requireAuth from '../middleware/auth.js';

const zonesRouter = Router({mergeParams: true});

zonesRouter.get('/', requireAuth, ZonesController.getSpaceZones);
zonesRouter.post('/', requireAuth, ZonesController.createZone);
zonesRouter.put('/:zoneId', requireAuth, ZonesController.updateZone);
zonesRouter.delete('/:zoneId', requireAuth, ZonesController.deleteZone);

export default zonesRouter;
