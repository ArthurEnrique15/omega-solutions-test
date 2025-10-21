import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { validate } from '../middlewares/validation.middleware';
import { signupSchema } from '../validators/signup.validator';
import { loginSchema } from '../validators/login.validator';

const router = Router();

router.post('', validate(signupSchema), (req, res) => userController.signup(req, res));
router.post('/login', validate(loginSchema), (req, res) => userController.login(req, res));

export default router;
