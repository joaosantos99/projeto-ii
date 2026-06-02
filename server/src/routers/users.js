import { Router } from 'express';

import UsersController from '../controllers/users.js';
import requireAuth from '../middleware/auth.js';
import requirePermission from '../middleware/requirePermission.js';

const usersRouter = Router();

usersRouter.get('/', requireAuth, requirePermission('users:read'), UsersController.getUsers);
usersRouter.post('/', requireAuth, requirePermission('users:create'), UsersController.createUser);
usersRouter.get('/:userId', requireAuth, requirePermission('users:read'), UsersController.getUserById);
usersRouter.put('/:userId', requireAuth, requirePermission('users:update'), UsersController.updateUser);
usersRouter.delete('/:userId', requireAuth, requirePermission('users:delete'), UsersController.deleteUser);

export default usersRouter;
