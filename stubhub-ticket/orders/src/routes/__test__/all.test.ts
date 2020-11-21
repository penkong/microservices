// ------------------------ Packages --------------------------

import request from 'supertest'
import mongoose from 'mongoose'

// ------------------------ Local --------------------------

import { app } from '../../app'
import { Ticket } from '../../models'

// ---------------------------------------------------------

const buildTicket = async () => {
  const ticket = Ticket.build({ id: '1', title: 'con', price: 20 })
  await ticket.save()
  return ticket
}

it('returns a fetcher order for a particular user', async () => {
  // const ticketId = mongoose.Types.ObjectId()

  const ticket1 = await buildTicket()
  const ticket2 = await buildTicket()
  const ticket3 = await buildTicket()

  const userOne = global.signup()
  const userTwo = global.signup()

  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket1.id })
    .expect(201)

  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticket2.id })
    .expect(201)

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticket3.id })
    .expect(201)

  const res = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200)

  expect(res.body[0].id).toEqual(orderOne.id)
  expect(res.body[1].id).toEqual(orderTwo.id)
  expect(res.body.length).toEqual(2)
})
