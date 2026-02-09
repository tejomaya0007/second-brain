import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import ApiError from '../utils/ApiError.js';

export const auth = async (req, res, next) => {
  try {
    // Try to get token from cookie first
    let token = req.cookies?.token;
    
    // Fallback to Authorization header
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.replace('Bearer ', '');
    }
    
    if (!token) {
      return next(new ApiError(401, 'No token provided'));
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user
    const user = await User.findByPk(decoded.userId, { 
      attributes: { exclude: ['passwordHash'] } 
    });
    
    if (!user) {
      // Stale token pointing to deleted user; clear cookie and require re-login
      if (req.cookies?.token) {
        res.clearCookie('token');
      }
      return next(new ApiError(401, 'User not found'));
    }
    
    req.user = user;
    next();
  } catch (error) {
    // Any JWT problem: clear cookie so frontend can establish a fresh session
    if (req.cookies?.token) {
      res.clearCookie('token');
    }

    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token expired'));
    }
    return next(new ApiError(401, 'Authentication failed'));
  }
};
