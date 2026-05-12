import { Router } from 'express';

import RolesController from '../controllers/roles.js';
import requireAuth from '../middleware/auth.js';
import requirePermission from '../middleware/requirePermission.js';

const rolesRouter = Router();

rolesRouter.get('/', requireAuth, requirePermission('roles:read'), RolesController.getRoles);
rolesRouter.post('/', requireAuth, requirePermission('roles:create'), RolesController.createRole);

export default rolesRouter;
