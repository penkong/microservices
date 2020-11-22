// ------------------------ Packages --------------------------

import { IExpirationCompleteEvent, OrderStatusEnum } from '@baneeem/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'

// ------------------------ Local --------------------------

import { ExpirationCompleteListener } from '../../'
import { Ticket, Order } from '../../../models'
import { natsWrapper } from '../../../nats-wrapper'

// ---------------------------------------------------------

const setup = async () => {
  // creat an listener
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const ticket = Ticket.build({
    title: 'ti',
    price: 434,
    id: new mongoose.Types.ObjectId().toHexString()
  })
  await ticket.save()

  const order = Order.build({
    status: OrderStatusEnum.Created,
    userId: 'fdsf',
    expireAt: new Date(),
    ticket
  })
  await order.save()

  // fake data
  const data: IExpirationCompleteEvent['data'] = {
    orderId: order.id
  }
  // create a fake message object nats
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg, order, ticket }
}

// ----------------------------------------------------------------

it('returns update order status to cancelled ', async () => {
  const { listener, data, msg, order, ticket } = await setup()

  // call on message func with  ...
  await listener.onMessage(data, msg)

  // write assertion
  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder?.status).toEqual(OrderStatusEnum.Cancelled)
})

// ---

it('returns emit an ordercancelled event', async () => {
  const { listener, data, msg, order, ticket } = await setup()

  // call on message func with  ...
  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const eData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  )

  expect(eData.id).toEqual(order.id)
})

// ---

it('returns ack the message', async () => {
  const { listener, data, msg, order, ticket } = await setup()

  // call on message func with  ...
  await listener.onMessage(data, msg)

  // wrtite assert ack called
  expect(msg.ack).toHaveBeenCalled()
})
