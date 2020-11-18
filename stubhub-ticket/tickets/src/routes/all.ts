// -------------------------- Pacakges ------------------------

import express, { Request, Response } from 'express'
import { NotFoundError } from '@baneeem/common'

// -------------------------- Local --------------------------

import { Ticket } from '../models'

// -----------------------------------------------------------

const router = express.Router()

router.get('/api/tickets/', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({})

  if (!tickets) throw new NotFoundError()

  res.status(200).send(tickets)
})

export const AllTicketRouter = router
