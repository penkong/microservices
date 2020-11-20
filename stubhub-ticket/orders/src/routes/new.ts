// -------------------------- Pacakges ------------------------

import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { requireAuth, validateRequest } from '@baneeem/common'

// -------------------------- Local --------------------------

import { natsWrapper } from '../nats-wrapper'

// -----------------------------------------------------------

const router = express.Router()

router.post(
  '/api/orders',
  // requireAuth,
  // [
  //   body('title').not().isEmpty().withMessage('title required'),
  //   body('price')
  //     .isFloat({ gt: 0 })
  //     .withMessage('price must be greater than zero')
  // ],
  // validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body

    // // publisher to nats
    // await new TicketCreatedPublisher(natsWrapper.client).publish({
    //   id: ticket.id,
    //   title: ticket.title,
    //   price: ticket.price,
    //   userId: ticket.userId
    // })

    res.status(201).send({})
  }
)

export const newOrderRouter = router
