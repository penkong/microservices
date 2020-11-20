// -------------------------- Pacakges ------------------------

import express, { Request, Response } from 'express'
import { NotFoundError, requireAuth, NotAuthorizedError } from '@baneeem/common'

// -------------------------- Local --------------------------

import { Order } from '../models'

// -----------------------------------------------------------

const router = express.Router()

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket')

    if (!order) throw new NotFoundError()

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()

    res.status(200).send(order)
  }
)

export const showOrderRouter = router
