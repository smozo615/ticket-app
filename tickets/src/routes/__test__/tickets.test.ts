import request from 'supertest';
import { app } from '../../app';

const createTicket = async () => {
  const cookie = await global.cookie();
  const title = 'Imagine Dragons';
  const price = 50;

  return request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title, price })
    .expect(201);
};

it('can fetch a list of tickets', async () => {
  await createTicket();
  await createTicket();

  const response = await request(app).get('/api/tickets').expect(200);

  expect(response.body.length).toEqual(2);
});
