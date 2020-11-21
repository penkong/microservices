// -------------------------- Pacakges ------------------------

import express, { Request, Response } from 'express'
import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatusEnum,
  requireAuth
} from '@baneeem/common'

// -------------------------- Local --------------------------

import { OrderCancelledPublisher } from '../events'
import { natsWrapper } from '../nats-wrapper'
import { Order } from '../models'

// -----------------------------------------------------------

const router = express.Router()

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params
    const order = await Order.findById(orderId).populate('ticket')

    if (!order) throw new NotFoundError()
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()

    order.status = OrderStatusEnum.Cancelled
    await order.save()

    // publish to nats order:created
    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.verion,
      ticket: {
        id: order.ticket.id
      }
    })

    res.status(204).send(order)
  }
)

export const deleteOrderRouter = router
