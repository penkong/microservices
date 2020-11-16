// ------------------------ Packages --------------------------

import request from 'supertest'

// ------------------------ Local --------------------------

import { app } from '../../app'

// ---------------------------------------------------------

it('returns a 201 on success signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)
})

it('returns a 400 with invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'testtest',
      password: 'password'
    })
    .expect(400)
})

it('returns a 400 with invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'pa'
    })
    .expect(400)
})

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com' })
    .expect(400)

  return request(app)
    .post('/api/users/signup')
    .send({ password: 'password' })
    .expect(400)
})

it('returns a dissallows duplicate email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400)
})

it('returns a sets a cookie after signup success', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)

  expect(res.get('Set-Cookie')).toBeDefined()
})
