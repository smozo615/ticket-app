import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var cookie: () => Promise<string[]>;
}

jest.mock('../nats');

let mongo: any;

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

global.cookie = async () => {
  // Build a JWT payload
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
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
