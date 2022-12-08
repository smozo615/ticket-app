import express, { Request, Response, NextFunction } from 'express';
import { requireAuth, validateRequest } from '@sm-ticket-app/common';
import { checkSchema } from 'express-validator';

import { CreateTicketSchema } from '../utils/validator-schemas/create-ticket-schema';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  checkSchema(CreateTicketSchema),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, price } = req.body;

      const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id,
      });
      await ticket.save();

      new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
      });

      return res.status(201).send(ticket);
    } catch (err) {
      next(err);
    }
  }
);

export { router as createTicketRouter };
