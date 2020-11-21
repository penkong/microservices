// ------------------------ Packages --------------------------

import request from 'supertest'
import mongoose from 'mongoose'

// ------------------------ Local --------------------------

import { app } from '../../app'
import { Ticket, Order } from '../../models'

// ---------------------------------------------------------

it('returns an order', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'tit',
    price: 10
  })
  await ticket.save()
  const cookie = global.signup()

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201)

  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200)

  expect(fetchOrder.id).toEqual(order.id)
})

it('returns an error if one user try fetch another user order', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'tit',
    price: 10
  })
  await ticket.save()

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(201)

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signup())
    .send()
    .expect(401)
})
