import {
  ForbiddenError,
  NotFoundError,
  requireAuth,
} from '@sm-ticket-app/common';
import express, { Request, Response, NextFunction } from 'express';

import { Order, OrderStatus } from '../models/order';

// Event Bus
import { natsWrapper } from '../nats';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.params;

      const order = await Order.findById(orderId).populate('ticket');

      if (!order) {
        throw new NotFoundError('Order not found');
      }

      if (order.userId !== req.currentUser!.id) {
        throw new ForbiddenError('Forbidden resource');
      }

      order.status = OrderStatus.Cancelled;
      await order.save();

      // Emit event: order:cancelled
      new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
          id: order.ticket.id,
        },
      });

      res.send(order);
    } catch (err) {
      next(err);
    }
  }
);

export { router as deleteOrderRouter };
