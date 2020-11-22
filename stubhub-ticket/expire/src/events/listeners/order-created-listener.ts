// -------------------------- Pacakges ------------------------

import { Subjects, Listener, IOrderCreatedEvent } from '@baneeem/common'
import { Message } from 'node-nats-streaming'

// -------------------------- Local --------------------------

import { queueGroupName } from '..'
import { expirationQueue } from '../../queues'

// -----------------------------------------------------------

export class OrderCreatedLitener extends Listener<IOrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated

  queueGroupName: string = queueGroupName

  async onMessage(data: IOrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
    await expirationQueue.add(
      {
        orderId: data.id
      },
      { delay }
    )
    msg.ack()
  }
}
