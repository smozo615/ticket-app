import express, { Request, Response } from 'express';
import { checkSchema } from 'express-validator';

import { CredentialsSchema } from '../utils/validator-schemas/credentials-schema';
import { ExpressValidator } from '../middlewares/express-validator-handler';

const router = express.Router();

router.post(
  '/api/users/signup',
  checkSchema(CredentialsSchema),
  ExpressValidator,
  (req: Request, res: Response) => {
    const { email, password } = req.body;
    res.json({ email, password });
  }
);

export { router as signupRouter };
