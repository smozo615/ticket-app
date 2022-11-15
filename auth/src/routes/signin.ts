import express, { NextFunction, Request, Response } from 'express';
import { checkSchema } from 'express-validator';

import { CredentialsSchema } from '../utils/validator-schemas/credentials-schema';
import { validateRequest } from '../middlewares/express-validator-handler';
import { BadRequestError } from '../errors/bad-request-error';
import { Password } from '../utils/password';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signin',
  checkSchema(CredentialsSchema),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        throw new BadRequestError('Invalid credentials');
      }

      const match = await Password.compare(existingUser.password, password);
      if (!match) {
        throw new BadRequestError('Invalid credentials');
      }

      res.json(match);
    } catch (err) {
      next(err);
    }
  }
);

export { router as signinRouter };
