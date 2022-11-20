import express, { Request, Response, NextFunction } from 'express';
import { requireAuth, validateRequest } from '@sm-ticket-app/common';
import { checkSchema } from 'express-validator';

import { CreateTicketSchema } from '../utils/validator-schemas/create-ticket-schema';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  checkSchema(CreateTicketSchema),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });
    await ticket.save();

    return res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
