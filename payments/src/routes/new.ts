import { requireAuth, validateRequest } from '@sm-ticket-app/common';
import express, { Request, Response, NextFunction } from 'express';
import { checkSchema } from 'express-validator';

import { CreateChargeSchema } from '../utils/validator-schemas/create-order-schema';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  checkSchema(CreateChargeSchema),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send({ success: true });
    } catch (err) {
      next(err);
    }
  }
);

export { router as CreateChargeRouter };
