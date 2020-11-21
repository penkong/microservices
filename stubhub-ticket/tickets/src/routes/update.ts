// -------------------------- Pacakges ------------------------

import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError
} from '@baneeem/common'

// -------------------------- Local --------------------------

import { Ticket } from '../models'
import { TicketUpdatedPublisher } from '../events'
import { natsWrapper } from '../nats-wrapper'

// -----------------------------------------------------------

const router = express.Router()

// current user is global middleware
router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('title required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('price must be greater than zero')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    //
    //
    const { title, price } = req.body
    const { id } = req.params

    // because we want compare userId with current can not use findandupdate
    const ticket = await Ticket.findById(id)

    if (!ticket) throw new NotFoundError()
    if (ticket.orderId) throw new BadRequestError('Already reserved')
    if (ticket.userId !== req.currentUser!.id) throw new NotAuthorizedError()

    ticket.set({
      title,
      price
    })

    await ticket.save()

    // publisher to nats
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version
    })

    res.status(200).send(ticket)
  }
)

export const updateTicketRouter = router
