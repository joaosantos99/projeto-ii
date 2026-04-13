import { Router } from 'express';

import SpacesController from '../controllers/spaces.js';

const spacesRouter = Router();

spacesRouter.get('/', SpacesController.getSpaces);
spacesRouter.get('/:spaceId', SpacesController.getSpaceById);
spacesRouter.post('/', SpacesController.createSpace);

export default spacesRouter;
