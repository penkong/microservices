// ------------------------ Packages --------------------------

import { IOrderCancelledEvent, OrderStatusEnum } from '@baneeem/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
// import request from 'supertest'

// ------------------------ Local --------------------------

import { OrderCancelledLitener } from '../../'
import { Order } from '../../../models'
import { natsWrapper } from '../../../nats-wrapper'

// ---------------------------------------------------------

const setup = async () => {
  // creat an listener
  const listener = new OrderCancelledLitener(natsWrapper.client)

  // create and save ticket

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatusEnum.Created,
    price: 10,
    userId: 'fdsf',
    version: 0
  })

  await order.save()

  // fake data
  const data: IOrderCancelledEvent['data'] = {
    id: order.id,
    version: 0,
    ticket: {
      id: 'fdsf'
    }
  }

  // create a fake message object nats
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg, order }
}

it('updates the status of order', async () => {
  const { listener, data, msg, order } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatusEnum.Cancelled)
})

it('ack the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
