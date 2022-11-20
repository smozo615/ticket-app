import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';

it('returns a 400 if the id is invalid', async () => {
  await request(app).get(`/api/tickets/asdfaf`).expect(400);
});

it('returns a 404 if ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/tickets/${id}`).expect(404);
});

it('returns the ticket if ticket was found', async () => {
  const cookie = await global.signup();
  const title = 'Imagine Dragons';
  const price = 50;

  const ticket = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title, price })
    .expect(201);

  const response = await request(app).get(`/api/tickets/${ticket.body.id}`);

  expect(response.status).toEqual(200);
  expect(response.body.title).toEqual(title);
  expect(response.body.price).toEqual(price);
});
