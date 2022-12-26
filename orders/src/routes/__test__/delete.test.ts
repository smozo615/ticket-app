import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';

// To ensure mock invocations (nats events)
import { natsWrapper } from '../../nats';

it('returns a 401 if user is not authenticated', async () => {
  await request(app)
    .delete(`/api/orders/${new mongoose.Types.ObjectId()}`)
    .send()
    .expect(401);
});

it('returns a 404 if order is not found', async () => {
  const cookie = await global.cookie();

  await request(app)
    .delete(`/api/orders/${new mongoose.Types.ObjectId()}`)
    .set('Cookie', cookie)
    .send()
    .expect(404);
});

it('returns a 403 if the user is not the owner of the order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'Imagine Dragons',
    price: 100,
  });
  await ticket.save();

  // Make a request to build an order as User #1
  const cookieOne = await global.cookie();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookieOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make a request to access this order as User #2
  const cookieTwo = await global.cookie();

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', cookieTwo)
    .send()
    .expect(403);
});

it('marks an order as cancelled', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'Imagine Dragons',
    price: 100,
  });
  await ticket.save();

  // Make a request to build an order
  const cookie = await global.cookie();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .expect(200);

  // expectation to make sure the order is cancelled
  const { body: updatedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(updatedOrder.status).toEqual(OrderStatus.Cancelled);
});

it.todo('emits an order cancelled event');
