// ------------------------ Packages --------------------------

import { OrderStatusEnum } from '@baneeem/common'
import request from 'supertest'

// ------------------------ Local --------------------------

import { natsWrapper } from '../../nats-wrapper'
import { Ticket, Order } from '../../models'
import { app } from '../../app'

// ---------------------------------------------------------

it('returns an order as cencelled', async () => {
  const ticket = Ticket.build({ title: 'tit', price: 10 })
  await ticket.save()
  const cookie = global.signup()

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201)

  const { body: cancelledOrder } = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(204)

  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatusEnum.Cancelled)
})

it('emits a order cancelled', async () => {
  const ticket = Ticket.build({ title: 'tit', price: 10 })
  await ticket.save()
  const cookie = global.signup()

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201)

  const { body: cancelledOrder } = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(204)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
