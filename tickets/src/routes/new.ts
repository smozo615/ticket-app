import express, { Request, Response, NextFunction } from 'express';
import { currentUser } from '@sm-ticket-app/common';

const router = express.Router();

router.post(
  '/api/tickets',
  (req: Request, res: Response, next: NextFunction) => {
    res.status(201).send({ status: 'Created' });
  }
);

export { router as createTicketRouter };
