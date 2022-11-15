import express, { NextFunction, Request, Response } from 'express';
import { checkSchema } from 'express-validator';
import jwt from 'jsonwebtoken';

import { CredentialsSchema } from '../utils/validator-schemas/credentials-schema';
import { ExpressValidator } from '../middlewares/express-validator-handler';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signup',
  checkSchema(CredentialsSchema),
  ExpressValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new BadRequestError('Email in use');
      }

      const user = User.build({ email, password });
      await user.save();

      // Generate JWT
      const payload = {
        id: user.id,
        email: user.email,
      };
      const userJwt = jwt.sign(payload, process.env.JWT_SECRET!);

      // Store it on the session object
      req.session = {
        jwt: userJwt,
      };

      res.status(201).send(user);
    } catch (err) {
      next(err);
    }
  }
);

export { router as signupRouter };
