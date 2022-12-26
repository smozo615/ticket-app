import express, { Request, Response, NextFunction } from 'express';
import { requireAuth } from '@sm-ticket-app/common';

import { Order } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await Order.find({ userId: req.currentUser!.id }).populate(
        'ticket'
      );

      res.send(orders);
    } catch (err) {
      next(err);
    }
  }
);

export { router as ordersRouter };
