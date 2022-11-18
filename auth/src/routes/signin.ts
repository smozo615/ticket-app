import express, { NextFunction, Request, Response } from 'express';
import { validateRequest } from '@sm-ticket-app/common';
import { checkSchema } from 'express-validator';

import { CredentialsSchema } from '../utils/validator-schemas/credentials-schema';
import { AuthService } from '../services/auth-service';

const router = express.Router();

router.post(
  '/api/users/signin',
  checkSchema(CredentialsSchema),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Verify credentials and return a JWT
      const userJwt = await AuthService.login({ email, password });

      // Store JWT on the session object
      req.session = {
        jwt: userJwt,
      };

      res.send({ status: 'logged in' });
    } catch (err) {
      next(err);
    }
  }
);

export { router as signinRouter };
