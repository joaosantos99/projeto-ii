import { Router } from 'express';

import UsersController from '../controllers/users.js';
import requireAuth from '../middleware/auth.js';
import requirePermission from '../middleware/requirePermission.js';

const usersRouter = Router();

usersRouter.get('/', UsersController.getUsers);
usersRouter.get('/:userId', requireAuth, requirePermission('users:read'), UsersController.getUserById);
usersRouter.delete('/:userId', requireAuth, requirePermission('users:delete'), UsersController.deleteUser);

export default usersRouter;
