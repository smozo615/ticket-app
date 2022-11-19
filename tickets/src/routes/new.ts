import express, { Request, Response, NextFunction } from 'express';
import { requireAuth, validateRequest } from '@sm-ticket-app/common';
import { checkSchema } from 'express-validator';

import { CreateTicketSchema } from '../utils/validator-schemas/create-ticket-schema';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  checkSchema(CreateTicketSchema),
  validateRequest,
  (req: Request, res: Response, next: NextFunction) => {
    res.status(201).send({ status: 'Created' });
  }
);

export { router as createTicketRouter };
