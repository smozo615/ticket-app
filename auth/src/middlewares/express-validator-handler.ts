import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const ExpressValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new Error('Invalid Request');
  }
  next();
};
