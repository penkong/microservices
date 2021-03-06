// -------------------------- Pacakges ------------------------

import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import { body } from 'express-validator'
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  OrderStatusEnum,
  BadRequestError
} from '@baneeem/common'

// -------------------------- Local --------------------------

import { natsWrapper } from '../nats-wrapper'
import { stripe } from '../stripe'
import { Order } from '../models'

// -----------------------------------------------------------

const router = express.Router()

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body
    const order = await Order.findById(orderId)
    if (!order) throw new NotFoundError()
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()
    if (order.status === OrderStatusEnum.Cancelled)
      throw new BadRequestError('Already cancelled')
    await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token
    })
    res.status(201).send({ success: true })
  }
)

export const newPaymentRouter = router
