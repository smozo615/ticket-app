import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { stripe } from '../../stripe';
import { Order, OrderStatus } from '../../models/orders';

it('returns 404 if order does not exist', async () => {
  const cookie = await global.cookie();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      orderId: new mongoose.Types.ObjectId().toHexString(),
      token: 'token',
    })
    .expect(404);
});

it('returns 403 if order does not belong to the user', async () => {
  const cookie = await global.cookie();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 100,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      orderId: order.id,
      token: 'token',
    })
    .expect(403);
});

it('returns 400 if the request data is invalid', async () => {
  const cookie = await global.cookie();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      orderId: 120,
      token: 'token',
    })
    .expect(400);
});

it('returns 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const cookie = await global.cookie(userId);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 100,
    status: OrderStatus.Created,
    userId,
    version: 0,
  });

  order.set({ status: OrderStatus.Cancelled });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      orderId: order.id,
      token: 'token',
    })
    .expect(400);
});

it('returns 201 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);

  const cookie = await global.cookie(userId);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price,
    status: OrderStatus.Created,
    userId,
    version: 0,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      orderId: order.id,
      token: 'tok_visa',
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('usd');
});
