import mongoose from 'mongoose';

import { app } from './app';

const PORT = 4000;

const start = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('jwt secret is not undefined ');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('Mongo Uri must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.log(err);
  }

  app.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`);
  });
};

start();
