// ------------------------ Packages --------------------------

import { ITicketCreatedEvent } from '@baneeem/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
// import request from 'supertest'

// ------------------------ Local --------------------------

import { TicketCreatedListener } from '../../'
import { Ticket } from '../../../models'
import { natsWrapper } from '../../../nats-wrapper'

// ---------------------------------------------------------

const setup = async () => {
  // creat an listener
  const listener = new TicketCreatedListener(natsWrapper.client)

  // fake data
  const data: ITicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString()
  }
  // create a fake message object nats
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg }
}

it('returns create and save a ticket ', async () => {
  const { listener, data, msg } = await setup()

  // call on message func with  ...
  await listener.onMessage(data, msg)

  // write assertion
  const ticket = await Ticket.findById(data.id)
  expect(ticket).toBeDefined()
  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)
})

it('returns ack the message', async () => {
  const { listener, data, msg } = await setup()

  // call on message func with  ...
  await listener.onMessage(data, msg)

  // wrtite assert ack called
  expect(msg.ack).toHaveBeenCalled()
})
