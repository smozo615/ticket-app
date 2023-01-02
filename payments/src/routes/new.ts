import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@sm-ticket-app/common';
import express, { Request, Response, NextFunction } from 'express';
import { checkSchema } from 'express-validator';

import { stripe } from '../stripe';
import { Order, OrderStatus } from '../models/orders';
import { CreateChargeSchema } from '../utils/validator-schemas/create-order-schema';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  checkSchema(CreateChargeSchema),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, orderId } = req.body;

      const order = await Order.findById(orderId);
      if (!order) {
        throw new NotFoundError('Order not found');
      }

      if (order.userId !== req.currentUser!.id) {
        throw new ForbiddenError('Forbidden resource');
      }

      if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError('Cannot pay for a cancelled order');
      }

      await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token,
      });

      res.status(201).send({ success: true });
    } catch (err) {
      next(err);
    }
  }
);

export { router as CreateChargeRouter };
