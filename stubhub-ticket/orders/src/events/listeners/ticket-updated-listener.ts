// -------------------------- Pacakges ------------------------

import { Subjects, Listener, ITicketUpdatedEvent } from '@baneeem/common'
import { Message } from 'node-nats-streaming'

// -------------------------- Local --------------------------

import { Ticket } from '../../models'
import { queueGroupName } from '../'

// -----------------------------------------------------------

export class TicketUpdatedListener extends Listener<ITicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated

  queueGroupName: string = queueGroupName

  async onMessage(data: ITicketUpdatedEvent['data'], msg: Message) {
    //

    const ticket = await Ticket.findOnEvent(data)

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    ticket.set({ title: data.title, price: data.price })
    await ticket.save()

    msg.ack()
  }
}
