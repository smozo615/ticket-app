import {
  ForbiddenError,
  NotFoundError,
  requireAuth,
} from '@sm-ticket-app/common';
import express, { Request, Response, NextFunction } from 'express';

import { Order } from '../models/order';

const router = express.Router();

router.get(
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

      res.send(order);
    } catch (err) {
      next(err);
    }
  }
);

export { router as orderByIdRouter };
