import { Router } from 'express';

import ReportsController from '../controllers/reports.js';

const reportsRouter = Router();

// POST /api/public/spaces/:spaceId/incident
publicSpacesRouter.post('/:spaceId/incident', ReportsController.createIncident);

// POST /api/public/spaces/:spaceId/comment
publicSpacesRouter.post('/:spaceId/comment', ReportsController.createComment);

export default publicSpacesRouter;