import { Router } from 'express';

import RolesController from '../controllers/roles.js';
import requireAuth from '../middleware/auth.js';
import requirePermission from '../middleware/requirePermission.js';

const rolesRouter = Router();

rolesRouter.get('/', requireAuth, requirePermission('roles:read'), RolesController.getRoles);
rolesRouter.get(
  '/permissions/catalog',
  requireAuth,
  requirePermission('roles:read'),
  RolesController.getPermissionsCatalog,
);
rolesRouter.post('/', requireAuth, requirePermission('roles:create'), RolesController.createRole);
rolesRouter.patch(
  '/:roleId/permissions',
  requireAuth,
  requirePermission('roles:update'),
  RolesController.updateRolePermission,
);

export default rolesRouter;
