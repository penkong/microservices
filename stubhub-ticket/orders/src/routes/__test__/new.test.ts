// ------------------------ Packages --------------------------

import request from 'supertest'
import mongoose from 'mongoose'
import { OrderStatusEnum } from '@baneeem/common'

// ------------------------ Local --------------------------

import { app } from '../../app'
import { Ticket, Order } from '../../models'
import { natsWrapper } from '../../nats-wrapper'

// ---------------------------------------------------------

it('returns an error if ticket not exist', async () => {
  const ticketId = mongoose.Types.ObjectId()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId })
    .expect(404)
})

it('returns an error if ticket reserved', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'ticket1',
    price: 20
  })
  await ticket.save()
  const order = Order.build({
    ticket,
    userId: 'fsdfsdfsd',
    status: OrderStatusEnum.Created,
    expireAt: new Date()
  })
  await order.save()
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(400)
})

it('returns a ticket', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'ticket2',
    price: 20
  })
  await ticket.save()
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(201)
})

it('emits an order created event', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'ticket2',
    price: 20
  })
  await ticket.save()
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
