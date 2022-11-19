import express, { Request, Response, NextFunction } from 'express';
import { currentUser, requireAuth } from '@sm-ticket-app/common';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  (req: Request, res: Response, next: NextFunction) => {
    res.status(201).send({ status: 'Created' });
  }
);

export { router as createTicketRouter };
