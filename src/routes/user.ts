import express from 'express';
import UserController from '../controllers/user';
import validate from '../middlewares/validate';
import { createUserSchema} from '../schemas/user';

const router = express.Router();

router.post('/new-user', validate(createUserSchema), UserController.createUser);

export default router;
