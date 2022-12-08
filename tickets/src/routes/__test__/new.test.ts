import request from 'supertest';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';

// To ensure mock invocations (nats events)
import { natsWrapper } from '../../nats';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status other than 401 if user is authenticated', async () => {
  const cookie = await global.cookie();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid TITLE is provided', async () => {
  const cookie = await global.cookie();

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: '', price: 50 })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ price: 50 })
    .expect(400);
});

it('returns an error if an invalid PRICE is provided', async () => {
  const cookie = await global.cookie();

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Imagine Dragons', price: -50 })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Imagine Dragons' })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const cookie = await global.cookie();
  const title = 'Imagine Dragons';
  const price = 50;

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title, price })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
});

it('publishes a created ticket event', async () => {
  const cookie = await global.cookie();
  const title = 'Imagine Dragons';
  const price = 50;

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title, price })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
