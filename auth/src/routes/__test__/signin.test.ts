import request from 'supertest';
import { app } from '../../app';

it('fails when a email that does not exist in db is supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'test123' })
    .expect(400);
});

it('fails when a incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'test123' })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'tes1234' })
    .expect(400);
});

it('set a cookie when valid credentials are supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'test123' })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'test123' })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
