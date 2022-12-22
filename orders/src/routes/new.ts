import express, { Request, Response, NextFunction } from 'express';
import { requireAuth, validateRequest } from '@sm-ticket-app/common';
import { checkSchema } from 'express-validator';
import { CreateOrderSchema } from '../utils/validator-schemas/create-order-schema';

const router = express.Router();

router.post(
  '/api/orders',
  requireAuth,
  checkSchema(CreateOrderSchema),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send({});
    } catch (err) {
      next(err);
    }
  }
);

export { router as createOrderRouter };
