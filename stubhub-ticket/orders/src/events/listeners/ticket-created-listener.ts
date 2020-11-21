// -------------------------- Pacakges ------------------------

import { Subjects, Listener, ITicketCreatedEvent } from '@baneeem/common'
import { Message } from 'node-nats-streaming'

// -------------------------- Local --------------------------

import { Ticket } from '../../models'
import { queueGroupName } from '../'

// -----------------------------------------------------------

export class TicketCreatedListener extends Listener<ITicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated

  queueGroupName: string = queueGroupName

  async onMessage(data: ITicketCreatedEvent['data'], msg: Message) {
    //
    const { title, price, id } = data
    const ticket = Ticket.build({ id, title, price })
    await ticket.save()
    msg.ack()
  }
}
