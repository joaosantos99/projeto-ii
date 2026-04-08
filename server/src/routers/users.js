import { Router } from 'express';

import UsersController from '../controllers/users';

const usersRouter = Router();

usersRouter.get('/', UsersController.getUsers);

export default usersRouter;
