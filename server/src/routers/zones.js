import { Router } from 'express';

import ZonesController from '../controllers/zones.js';

const zonesRouter = Router({mergeParams: true});

zonesRouter.get('/', ZonesController.getSpaceZones);
zonesRouter.get('/:zoneId', ZonesController.getZoneById);
zonesRouter.put('/:zoneId', ZonesController.updateZone);
zonesRouter.delete('/:zoneId', ZonesController.deleteZone);

export default zonesRouter;
