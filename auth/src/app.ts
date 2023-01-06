import express from 'express';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@sm-ticket-app/common';

import { profileRouter } from './routes/profile';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

const app = express();

app.set('trust proxy', true);

// Enable JSON
app.use(express.json());

// Cookies
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

// Routes
app.use(profileRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

// Not found route
app.all('*', async (req, res, next) => {
  next(new NotFoundError());
});

// Errors Handler
app.use(errorHandler);

export { app };
