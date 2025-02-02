import express from 'express';
import { login, logout, getMe } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', auth, getMe);

export default router; 