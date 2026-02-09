import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import ApiError from '../utils/ApiError.js';

export const register = async (req, res, next) => {
  const { email, password, name } = req.body;
  const exists = await User.findOne({ where: { email } });
  if (exists) return next(new ApiError(409, 'Email already registered'));

  // Password will be hashed by the model hook
  const user = await User.create({ email, passwordHash: password, name });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    // For cross-origin frontend (localhost:5173) <-> backend (localhost:4001),
    // we need SameSite=None so the cookie is sent on XHR/fetch.
    sameSite: 'none',
    secure: isProduction ? true : true, // localhost is treated as secure by modern browsers
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({ user: { id: user.id, email: user.email, name: user.name } });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.comparePassword(password))) {
    return next(new ApiError(401, 'Invalid credentials'));
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    // Match register() cookie options for cross-origin frontend/backend
    sameSite: 'none',
    secure: isProduction ? true : true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({ user: { id: user.id, email: user.email, name: user.name } });
};

export const logout = async (req, res, next) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

export const getMe = async (req, res, next) => {
  res.json({ user: req.user });
};

export const updateMe = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return next(new ApiError(400, 'Name is required'));
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    user.name = name.trim();
    await user.save();

    // Keep response shape consistent with login/register
    res.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
};
