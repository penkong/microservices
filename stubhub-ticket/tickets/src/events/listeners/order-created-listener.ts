// -------------------------- Pacakges ------------------------

import { Subjects, Listener, IOrderCreatedEvent } from '@baneeem/common'
import { Message } from 'node-nats-streaming'

// -------------------------- Local --------------------------

import { queueGroupName, TicketUpdatedPublisher } from '../'
import { Ticket } from '../../models'

// -----------------------------------------------------------
export class OrderCreatedLitener extends Listener<IOrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated

  queueGroupName: string = queueGroupName

  async onMessage(data: IOrderCreatedEvent['data'], msg: Message) {
    // find ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id)
    if (!ticket) throw new Error('ticket not found')

    // mark ticket
    ticket.set({ orderId: data.id })

    // save ticket
    await ticket.save()
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version
    })

    msg.ack()
  }
}
