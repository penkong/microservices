// -------------------------- Pacakges ------------------------

import express, { Request, Response } from 'express'
import { NotFoundError } from '@baneeem/common'

// -------------------------- Local --------------------------

import { Ticket } from '../models'

// -----------------------------------------------------------

const router = express.Router()

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) throw new NotFoundError()

  res.status(200).send(ticket)
})

export const showTicketRouter = router
