// -------------------------- Pacakges ------------------------

import { Subjects, Listener, IOrderCreatedEvent } from '@baneeem/common'
import { Message } from 'node-nats-streaming'

// -------------------------- Local --------------------------

import { queueGroupName } from '..'

// -----------------------------------------------------------

export class OrderCreatedLitener extends Listener<IOrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated

  queueGroupName: string = queueGroupName

  async onMessage(data: IOrderCreatedEvent['data'], msg: Message) {
    msg.ack()
  }
}
