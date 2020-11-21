// ------------------------ Packages --------------------------

import { IOrderCancelledEvent, OrderStatusEnum } from '@baneeem/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
// import request from 'supertest'

// ------------------------ Local --------------------------

import { OrderCancelledLitener } from '../../'
import { Ticket } from '../../../models'
import { natsWrapper } from '../../../nats-wrapper'

// ---------------------------------------------------------

const setup = async () => {
  // creat an listener
  const listener = new OrderCancelledLitener(natsWrapper.client)

  // create and save ticket
  const orderId = new mongoose.Types.ObjectId().toHexString()

  const ticket = Ticket.build({
    title: 'title',
    price: 55,
    userId: 'fsdfsdfsd'
  })

  ticket.set({ orderId })

  await ticket.save()

  // fake data
  const data: IOrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id
    }
  }

  // create a fake message object nats
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg, ticket }
}

it('update the ticket publish event and ack the message', async () => {
  const { listener, ticket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.orderId).toEqual(undefined)
  expect(msg.ack).toHaveBeenCalled()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
