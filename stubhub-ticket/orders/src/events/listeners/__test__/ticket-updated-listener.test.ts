// ------------------------ Packages --------------------------

import { ITicketUpdatedEvent } from '@baneeem/common'
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

  // create and save ticket
  const id = new mongoose.Types.ObjectId().toHexString()
  const ticket = Ticket.build({ id, title: 'title', price: 22 })
  await ticket.save()

  // fake data
  const data: ITicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString()
  }

  // create a fake message object nats
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, ticket, data, msg }
}

// ---------------------------------------------------------

it('returns finds update and save a ticket ', async () => {
  const { listener, ticket, data, msg } = await setup()

  // call on message func with  ...
  await listener.onMessage(data, msg)

  // write assertion
  const udpatetTicket = await Ticket.findById(ticket.id)

  expect(udpatetTicket).toBeDefined()
  expect(udpatetTicket!.title).toEqual(data.title)
  expect(udpatetTicket!.price).toEqual(data.price)
  expect(udpatetTicket!.version).toEqual(data.version)
})

// ---

it('returns ack the message', async () => {
  const { listener, data, msg } = await setup()

  // call on message func with  ...
  await listener.onMessage(data, msg)

  // wrtite assert ack called
  expect(msg.ack).toHaveBeenCalled()
})

// ---

it('returns does not call ack if event has skipped version', async () => {
  const { listener, data, msg, ticket } = await setup()

  // call on message func with  ...
  data.version = 10

  try {
    await listener.onMessage(data, msg)
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled()
})
