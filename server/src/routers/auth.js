import { Router } from 'express';

import AuthController from '../controllers/auth.js';
import requireAuth from '../middleware/auth.js';

const authRouter = Router();

authRouter.post('/login', AuthController.login);
authRouter.post('/forgot-password', AuthController.forgotPassword);
authRouter.patch('/update-password', AuthController.updatePassword);
authRouter.get('/me', requireAuth, AuthController.getMe);

export default authRouter;
