// -------------------------- Pacakges ------------------------

import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatusEnum
} from '@baneeem/common'
import mongoose from 'mongoose'

// -------------------------- Local --------------------------

import { natsWrapper } from '../nats-wrapper'
import { Ticket, Order } from '../models'
import { BadRequestError } from '@baneeem/common'

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

    res.status(201).send(order)
  }
)

export const newOrderRouter = router

// // publisher to nats
// await new TicketCreatedPublisher(natsWrapper.client).publish({
//   id: ticket.id,
//   title: ticket.title,
//   price: ticket.price,
//   userId: ticket.userId
// })
