// ------------------------ Packages --------------------------

import request from 'supertest'

// ------------------------ Local --------------------------

import { app } from '../../app'

// ---------------------------------------------------------

it('returns a response with current user info', async () => {
  const cookie = await global.signup()

  const res = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .expect(200)

  expect(res.body.currentUser.email).toEqual('test@test.com')
})

it('returns a NULL if not authenticated', async () => {
  const res = await request(app).get('/api/users/currentuser').expect(200)
  expect(res.body.currentUser).toEqual(null)
})
