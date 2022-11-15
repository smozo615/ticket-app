import express from 'express';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { profileRouter } from './routes/profile';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const PORT = 4000;

const app = express();

app.set('trust proxy', true);

// Enable JSON
app.use(express.json());

// Cookies
app.use(
  cookieSession({
    signed: false,
    secure: true,
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

const start = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('jwt secret is not undefined ');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
  } catch (err) {
    console.log(err);
  }

  app.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`);
  });
};

start();
