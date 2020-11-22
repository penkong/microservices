// -------------------------- Pacakges ------------------------

import {
  Subjects,
  Listener,
  IExpirationCompleteEvent,
  OrderStatusEnum
} from '@baneeem/common'
import { Message } from 'node-nats-streaming'

// -------------------------- Local --------------------------

import { Order } from '../../models'
import { queueGroupName, OrderCancelledPublisher } from '../'
import { natsWrapper } from '../../nats-wrapper'

// -----------------------------------------------------------

export class ExpirationCompleteListener extends Listener<IExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete

  queueGroupName: string = queueGroupName

  async onMessage(data: IExpirationCompleteEvent['data'], msg: Message) {
    //
    const order = await Order.findById(data.orderId).populate('ticket')

    if (!order) throw new Error('order not found ')

    if (order.status === OrderStatusEnum.Complete) return msg.ack()

    order.set({ status: OrderStatusEnum.Cancelled })
    await order.save()

    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.verion,
      ticket: {
        id: order.ticket.id
      }
    })

    msg.ack()
  }
}
