// ------------------------ Packages --------------------------

import { IOrderCreatedEvent, OrderStatusEnum } from '@baneeem/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
// import request from 'supertest'

// ------------------------ Local --------------------------

import { OrderCreatedLitener } from '../../'
import { Ticket } from '../../../models'
import { natsWrapper } from '../../../nats-wrapper'

// ---------------------------------------------------------

const setup = async () => {
  // creat an listener
  const listener = new OrderCreatedLitener(natsWrapper.client)

  // create and save ticket
  const ticket = Ticket.build({
    title: 'title',
    price: 55,
    userId: 'fsdfsdfsd'
  })
  await ticket.save()

  // fake data
  const data: IOrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatusEnum.Created,
    userId: 'fsdfsdfsdf',
    expiresAt: 'fsdfsdfsd',
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  }
  // create a fake message object nats
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg, ticket }
}

it('returns sets the userId of the ticket ', async () => {
  const { listener, ticket, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.orderId).toEqual(data.id)
})

it('returns ack the message ', async () => {
  const { listener, ticket, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})

it('returns a published ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
