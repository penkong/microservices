// -------------------------- Pacakges ------------------------

import { Subjects, Listener, IOrderCreatedEvent } from '@baneeem/common'
import { Message } from 'node-nats-streaming'

// -------------------------- Local --------------------------

import { queueGroupName } from '../'
import { Order } from '../../models/order.model'

// -----------------------------------------------------------

export class OrderCreatedLitener extends Listener<IOrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated

  queueGroupName: string = queueGroupName

  async onMessage(data: IOrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version
    })
    await order.save()
    msg.ack()
  }
}
