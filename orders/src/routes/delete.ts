import {
  ForbiddenError,
  NotFoundError,
  requireAuth,
} from '@sm-ticket-app/common';
import express, { Request, Response, NextFunction } from 'express';

import { Order, OrderStatus } from '../models/order';

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

      res.send(order);
    } catch (err) {
      next(err);
    }
  }
);

export { router as deleteOrderRouter };
