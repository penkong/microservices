// -------------------------- Pacakges ------------------------

import express, { Request, Response } from 'express'
import { NotFoundError } from '@baneeem/common'

// -------------------------- Local --------------------------

// -----------------------------------------------------------

const router = express.Router()

router.get('/api/orders/', async (req: Request, res: Response) => {
  res.status(200).send({})
})

export const allOrdersRouter = router
