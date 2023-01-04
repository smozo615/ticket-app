import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var cookie: (id?: string) => Promise<string[]>;
}

jest.mock('../nats');

let mongo: any;

process.env.STRIPE_KEY =
  'sk_test_51MLgULFgKTyI8x6XqgLtm11Q9mARZYjxjm0eE8czsLCpXEPlGZLuikuL8SOR0pzZPegUw8ocawFnmV8FDgYIgACh00snwd62md';

beforeAll(async () => {
  process.env.JWT_SECRET = 'asdfasdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.cookie = async (id?: string) => {
  // Build a JWT payload
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // Create JWT
  const token = jwt.sign(payload, process.env.JWT_SECRET!);

  // Build session Object
  const session = { jwt: token };

  // Turns into a JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // Returns a string thats the cookie with encoded data
  return [`session=${base64}`];
};
