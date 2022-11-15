import express, { NextFunction, Request, Response } from 'express';
import { checkSchema } from 'express-validator';

import { CredentialsSchema } from '../utils/validator-schemas/credentials-schema';
import { validateRequest } from '../middlewares/express-validator-handler';
import { AuthService } from '../services/auth-service';

const router = express.Router();

router.post(
  '/api/users/signup',
  checkSchema(CredentialsSchema),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Store user in DB and return a JWT
      const userJwt = await AuthService.register({ email, password });

      // Store JWT on the session object
      req.session = {
        jwt: userJwt,
      };

      res.status(201).send({ status: 'Signed up' });
    } catch (err) {
      next(err);
    }
  }
);

export { router as signupRouter };
