import express from 'express';
import mongoose from 'mongoose';

import { profileRouter } from './routes/profile';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const PORT = 4000;

const app = express();

app.use(express.json());

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
