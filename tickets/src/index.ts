import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats';

const PORT = 4001;

const start = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('jwt secret must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('Mongo Uri must be defined');
  }

  try {
    await natsWrapper.connect('ticket-app', 'asdf', 'http://nats-srv:4222');
    natsWrapper.client.on('close', () => {
      console.log('NATS connection close');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.log(err);
  }

  app.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`);
  });
};

start();
