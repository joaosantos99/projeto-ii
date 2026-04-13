import { Router } from 'express';

import UsersController from '../controllers/users.js';

const usersRouter = Router();

usersRouter.get('/', UsersController.getUsers);

export default usersRouter;
