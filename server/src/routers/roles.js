import { Router } from 'express';

import RolesController from '../controllers/roles.js';
import requireAuth from '../middleware/auth.js';
import requirePermission from '../middleware/requirePermission.js';

const rolesRouter = Router();

rolesRouter.get('/', requireAuth, requirePermission('roles:read'), RolesController.getRoles);
rolesRouter.post('/', requireAuth, requirePermission('roles:create'), RolesController.createRole);

rolesRouter.put(
  '/:roleId/permissions/:permissionId',
  requireAuth,
  requirePermission('roles:update'),
  RolesController.grantPermission,
);
rolesRouter.delete(
  '/:roleId/permissions/:permissionId',
  requireAuth,
  requirePermission('roles:update'),
  RolesController.revokePermission,
);

export default rolesRouter;
