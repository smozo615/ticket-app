import express, { Request, Response, NextFunction } from 'express';
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@sm-ticket-app/common';
import { checkSchema } from 'express-validator';

import { CreateOrderSchema } from '../utils/validator-schemas/create-order-schema';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

const router = express.Router();

// The time in seconds that the order is valid
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/orders',
  requireAuth,
  checkSchema(CreateOrderSchema),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ticketId } = req.body;

      // Find the ticket the user is trying to order in the DB
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        throw new NotFoundError('Ticket was not found');
      }

      // Make sure tha this ticket is not already reserved
      const isReserved = await ticket.isReserved();
      if (isReserved) {
        throw new BadRequestError('Ticket is already reserved');
      }

      // Calculate expiration date for this order
      const expiration = new Date();
      expiration.setSeconds(
        expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS
      );

      // Create order and store it to the DB
      const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket,
      });

      await order.save();

      // Emit event: order:created

      res.status(201).send(order);
    } catch (err) {
      next(err);
    }
  }
);

export { router as createOrderRouter };
