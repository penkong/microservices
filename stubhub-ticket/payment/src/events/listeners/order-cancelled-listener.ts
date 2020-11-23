// -------------------------- Pacakges ------------------------

import {
  Subjects,
  Listener,
  IOrderCancelledEvent,
  OrderStatusEnum
} from '@baneeem/common'
import { Message } from 'node-nats-streaming'

// -------------------------- Local --------------------------

import { queueGroupName } from '../'
import { Order } from '../../models'

// -----------------------------------------------------------

export class OrderCancelledLitener extends Listener<IOrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled

  queueGroupName: string = queueGroupName

  async onMessage(data: IOrderCancelledEvent['data'], msg: Message) {
    // find ticket that the order is reserving
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1
    })

    if (!order) throw new Error('order not found')

    order.set({ status: OrderStatusEnum.Cancelled })
    await order.save()
    msg.ack()
  }
}
