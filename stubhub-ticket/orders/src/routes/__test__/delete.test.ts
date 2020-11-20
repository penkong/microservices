// ------------------------ Packages --------------------------

import request from 'supertest'
import { OrderStatusEnum } from '@baneeem/common'

// ------------------------ Local --------------------------

import { app } from '../../app'
import { Ticket, Order } from '../../models'

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
