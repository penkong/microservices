// ------------------------ Packages --------------------------

import { IOrderCreatedEvent, OrderStatusEnum } from '@baneeem/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
// import request from 'supertest'

// ------------------------ Local --------------------------

import { OrderCreatedLitener } from '../../'
import { Order } from '../../../models/order.model'
import { natsWrapper } from '../../../nats-wrapper'

// ---------------------------------------------------------

const setup = async () => {
  // creat an listener
  const listener = new OrderCreatedLitener(natsWrapper.client)

  // fake data
  const data: IOrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatusEnum.Created,
    userId: 'fsdfsdfsdf',
    expiresAt: 'fsdfsdfsd',
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 10
    }
  }
  // create a fake message object nats
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg }
}

it('returns replicated order info ', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const order = await Order.findById(data.id)
  expect(order!.price).toEqual(data.ticket.price)
})

it('returns ack the message ', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})
