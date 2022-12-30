import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';

// To ensure mock invocations (nats events)
import { natsWrapper } from '../../nats';

it('has a route handler listening to /api/orders for post requests', async () => {
  const response = await request(app).post('/api/orders').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/orders').send({}).expect(401);
});

it('returns a status other than 401 if user is authenticated', async () => {
  const cookie = await global.cookie();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid ticketId is provided', async () => {
  const cookie = await global.cookie();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: '' })
    .expect(400);
});

it('returns an error if the ticket does not exist', async () => {
  const cookie = await global.cookie();
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId })
    .expect(404);
});

it('returns an error if the ticket is reserved', async () => {
  const cookie = await global.cookie();

  const ticket = Ticket.build({
    title: 'Imagine Dragons',
    price: 100,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: '1234',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const cookie = await global.cookie();

  const ticket = Ticket.build({
    title: 'Imagine Dragons',
    price: 100,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits an order created event', async () => {
  const cookie = await global.cookie();

  const ticket = Ticket.build({
    title: 'Imagine Dragons',
    price: 100,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toBeCalled();
});
