import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

export const validate = (validations, source = 'body') => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map(err => err.msg);
      return next(new ApiError(400, messages.join(', ')));
    }

    next();
  };
};
