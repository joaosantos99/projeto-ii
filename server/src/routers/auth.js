import { Router } from 'express';

import AuthController from '../controllers/auth.js';
import requireAuth from '../middleware/auth.js';

const authRouter = Router();

authRouter.post('/login', AuthController.login);
authRouter.post('/forgot-password', AuthController.forgotPassword);
authRouter.patch('/update-password', AuthController.updatePassword);
authRouter.get('/me', requireAuth, AuthController.getMe);
authRouter.patch('/me', requireAuth, AuthController.updateMe);
authRouter.patch('/change-password', requireAuth, AuthController.changePassword);

export default authRouter;
