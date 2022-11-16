import mongoose from 'mongoose';

import { app } from './app';

const PORT = 4000;

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
