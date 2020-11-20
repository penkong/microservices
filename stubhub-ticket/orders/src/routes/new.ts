// -------------------------- Pacakges ------------------------

import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import { body } from 'express-validator'
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatusEnum,
  BadRequestError
} from '@baneeem/common'

// -------------------------- Local --------------------------

import { OrderCreatedPublisher } from '../events'
import { natsWrapper } from '../nats-wrapper'
import { Ticket, Order } from '../models'

// -----------------------------------------------------------

const router = express.Router()

const EXP_WINDOW_SECONDS = 15 * 60

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('ticket id must provided')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body

    // find ticket the user is try to order
    const ticket = await Ticket.findById(ticketId)

    if (!ticket) throw new NotFoundError()

    // Make sure ticket is not already reserved
    // look at all orders find an order where the ticket we found already ,
    // and status not cancelled , if we find an order means ticket is reserved
    const isReserved = await ticket.isReserved()
    if (isReserved) throw new BadRequestError('Already Reserved')

    // calc expiration time
    const expriation = new Date()
    expriation.setSeconds(expriation.getSeconds() + EXP_WINDOW_SECONDS)

    // build the order and save it
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatusEnum.Created,
      expireAt: expriation,
      ticket
    })

    await order.save()

    // publish to nats order:created
    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expireAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price
      }
    })

    res.status(201).send(order)
  }
)

export const newOrderRouter = router
