// -------------------------- Pacakges ------------------------

import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError
} from '@baneeem/common'

// -------------------------- Local --------------------------

import { Ticket } from '../models'

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
    const { title, price } = req.body
    const { id } = req.params

    const ticket = await Ticket.findById(id)
    if (!ticket) throw new NotFoundError()

    if (ticket.userId !== req.currentUser!.id) throw new NotAuthorizedError()

    ticket.set({
      title,
      price
    })

    await ticket.save()

    res.status(200).send({})
  }
)

export const updateTicketRouter = router
