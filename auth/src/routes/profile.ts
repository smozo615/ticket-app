import express, { Request, Response, NextFunction } from 'express';

import { currentUser } from '../middlewares/current-user';

const router = express.Router();

router.get(
  '/api/users/profile',
  currentUser,
  (req: Request, res: Response, next: NextFunction) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as profileRouter };
