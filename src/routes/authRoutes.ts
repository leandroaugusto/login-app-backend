import { Router } from 'express';

import { createUser, authenticate, refreshToken } from '../controllers/user';

const router = Router();

router.post('/register', createUser);
router.post('/login', authenticate);
router.post('/refresh-token', refreshToken);

export default router;
