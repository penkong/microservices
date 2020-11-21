// -------------------------- Pacakges ------------------------

import { Subjects, Listener, IOrderCancelledEvent } from '@baneeem/common'
import { Message } from 'node-nats-streaming'

// -------------------------- Local --------------------------

import { queueGroupName, TicketUpdatedPublisher } from '../'
import { Ticket } from '../../models'

// -----------------------------------------------------------
export class OrderCancelledLitener extends Listener<IOrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled

  queueGroupName: string = queueGroupName

  async onMessage(data: IOrderCancelledEvent['data'], msg: Message) {
    // find ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id)
    if (!ticket) throw new Error('ticket not found')

    // mark ticket
    ticket.set({ orderId: undefined })

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
