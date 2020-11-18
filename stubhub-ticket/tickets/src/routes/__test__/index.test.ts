// ------------------------ Packages --------------------------

import request from 'supertest'
import mongoose from 'mongoose'

// ------------------------ Local --------------------------

import { app } from '../../app'

// ---------------------------------------------------------

const createTicketHelper = (title: string) => {
  return request(app)
    .post(`/api/tickets/`)
    .set('Cookie', global.signup())
    .send({
      title,
      price: 4
    })
}

it('returns list of tickets', async () => {
  await createTicketHelper('sth1')
  await createTicketHelper('sth2')
  await createTicketHelper('sth3')
  const res = await request(app).get('/api/tickets').send().expect(200)
  expect(res.body.length).toEqual(3)
})
