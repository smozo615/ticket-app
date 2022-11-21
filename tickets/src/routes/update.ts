import express, { Request, Response, NextFunction } from 'express';
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  ForbiddenError,
} from '@sm-ticket-app/common';
import { checkSchema } from 'express-validator';

import { Ticket } from '../models/ticket';
import { updateTicketSchema } from '../utils/validator-schemas/update-ticket-schema';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  checkSchema(updateTicketSchema),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticket = await Ticket.findById(req.params.id);

      if (!ticket) {
        throw new NotFoundError('Ticket not found');
      }

      if (ticket.userId !== req.currentUser!.id) {
        throw new ForbiddenError('Forbidden');
      }

      ticket.set({ ...req.body });
      await ticket.save();

      res.send(ticket);
    } catch (err) {
      next(err);
    }
  }
);

export { router as updateTicketRouter };
