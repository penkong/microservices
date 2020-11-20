// ------------------------ Packages --------------------------

import request from 'supertest'

// ------------------------ Local --------------------------

import { app } from '../../app'
import { Ticket } from '../../models'
import { natsWrapper } from '../../nats-wrapper'

// ---------------------------------------------------------

it('returns a route handler listen to /api/tickets for post', async () => {
  const res = await request(app).post('/api/tickets').send({})
  expect(res.status).not.toEqual(404)
})

it('returns can only access if user signed in ', async () => {
  await request(app).post('/api/tickets').send({}).expect(401)
})

it('returns status other than 401 if user signed in ', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({})
  expect(res.status).not.toEqual(401)
})

it('returns an error if an invalid title provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: '', price: 10 })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ price: 10 })
    .expect(400)
})

it('returns an error if an invalid price provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'sth', price: -3 })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'sth' })
    .expect(400)
})

it('returns a ticke creation with valid inputs', async () => {
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)

  // add check to make sure a ticket saved
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'sth', price: 3 })
    .expect(201)

  tickets = await Ticket.find({})
  expect(tickets.length).toEqual(1)
  expect(tickets[0].title).toEqual('sth')
  expect(tickets[0].price).toEqual(3)
})

it('return a publish event', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'sth', price: 3 })
    .expect(201)

  // console.log(natsWrapper`)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
