import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';

// To ensure mock invocations (nats events)
import { natsWrapper } from '../../nats';

it('Returns a 400 if request is not valid', async () => {
  const cookie = await global.cookie();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'title',
      price: 50,
    })
    .expect(201);

  // Bad MongoId
  await request(app)
    .put(`/api/tickets/aksdf`)
    .set('Cookie', cookie)
    .send({
      title: 'title ok',
      price: 50,
    })
    .expect(400);

  // Bad Title
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 23,
    })
    .expect(400);

  // Bad Price
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      price: -50,
    })
    .expect(400);
});

it('Returns a 401 if user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'title updated',
      price: 50,
    })
    .expect(401);
});

it('Returns a 403 if user is not the owner of the ticket', async () => {
  const cookie_1 = await global.cookie();
  const cookie_2 = await global.cookie();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie_1)
    .send({
      title: 'title',
      price: 50,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie_2)
    .send({
      title: 'title updated',
      price: 50,
    })
    .expect(403);
});

it('Returns a 404 if ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const cookie = await global.cookie();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title: 'title updated',
      price: 50,
    })
    .expect(404);
});

it('Returns a 200 if ticket was updated', async () => {
  const cookie = await global.cookie();

  const ticket = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'title',
      price: 20,
    })
    .expect(201);

  const response = await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'title updated',
      price: 50,
    });

  expect(response.statusCode).toEqual(200);
  expect(response.body.title).toEqual('title updated');
  expect(response.body.price).toEqual(50);
});

it('publishes a updated ticket event', async () => {
  const cookie = await global.cookie();

  const ticket = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'title',
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'title updated',
      price: 50,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
  const cookie = await global.cookie();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'title',
      price: 20,
    })
    .expect(201);

  // Reserved ticket
  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'title updated',
      price: 50,
    })
    .expect(400);
});
