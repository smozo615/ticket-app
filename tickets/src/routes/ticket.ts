import express, { Request, Response, NextFunction } from 'express';
import { NotFoundError, validateRequest } from '@sm-ticket-app/common';
import { checkSchema } from 'express-validator';

import { MongoIdSchema } from '../utils/validator-schemas/get-ticket-by-id-schema';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get(
  '/api/tickets/:id',
  checkSchema(MongoIdSchema),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) {
        throw new NotFoundError('Ticket not found');
      }
      res.send(ticket);
    } catch (err) {
      next(err);
    }
  }
);

export { router as getTicketRouter };
