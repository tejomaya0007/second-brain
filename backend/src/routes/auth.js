import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { register, login, logout, getMe, updateMe } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register',
  validate([
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').optional().trim().isLength({ min: 1 }),
  ], 'body'),
  register
);

router.post('/login',
  validate([
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ], 'body'),
  login
);

router.post('/logout', logout);
router.get('/me', auth, getMe);
router.put('/me', auth, updateMe);

export default router;
