// ------------------------ Packages --------------------------

import request from 'supertest'

// ------------------------ Local --------------------------

import { app } from '../../app'

// ---------------------------------------------------------

it('returns a 404 if ticket not found', async () => {
  await request(app).get('/api/tickets/435t34gfwfs').send().expect(404)
  // console.log(res.body)
})

it('returns a ticket if ticket found', async () => {
  const title = 'concert'
  const price = 20

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title, price })
    .expect(201)

  const ticketRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()
    .expect(200)

  expect(ticketRes.body.title).toEqual(title)
  expect(ticketRes.body.price).toEqual(price)
})
