import { Router } from 'express';

import PermissionsController from '../controllers/permissions.js';
import requireAuth from '../middleware/auth.js';
import requirePermission from '../middleware/requirePermission.js';

const permissionsRouter = Router();

permissionsRouter.get(
  '/',
  requireAuth,
  requirePermission('roles:read'),
  PermissionsController.getPermissions,
);

export default permissionsRouter;
