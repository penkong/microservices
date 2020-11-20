// -------------------------- Pacakges ------------------------

import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { requireAuth, validateRequest } from '@baneeem/common'

// -------------------------- Local --------------------------

import { natsWrapper } from '../nats-wrapper'
import { Ticket } from '../models'
import { TicketCreatedPublisher } from '../events'

// -----------------------------------------------------------

const router = express.Router()

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('title required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('price must be greater than zero')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id
    })

    await ticket.save()

    // publisher to nats
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    })

    res.status(201).send(ticket)
  }
)

export const createTicketRouter = router
