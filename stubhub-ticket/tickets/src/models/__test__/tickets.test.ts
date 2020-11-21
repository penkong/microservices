// ------------------------ Packages --------------------------

import request from 'supertest'

// ------------------------ Local --------------------------

import { app } from '../../app'
import { Ticket } from '../../models'
import { natsWrapper } from '../../nats-wrapper'

// ---------------------------------------------------------

it('returns optimistic concurrency control', async (done) => {
  const ticket = Ticket.build({ title: 'sfd', price: 5, userId: '23' })
  await ticket.save()

  const first = await Ticket.findById(ticket.id)
  const second = await Ticket.findById(ticket.id)

  first!.set({ pirce: 10 })
  second!.set({ pirce: 15 })

  await first!.save()

  // expect(() => {}).toThrow()
  try {
    await second!.save()
  } catch (e) {
    return done()
  }
  throw new Error('should not reach here')
})

it('retruns increment number on multi save', async () => {
  const ticket = Ticket.build({
    title: 'con',
    price: 20,
    userId: '23'
  })

  await ticket.save()

  expect(ticket.version).toEqual(0)
  await ticket.save()
  expect(ticket.version).toEqual(1)
})
