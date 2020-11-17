// -------------------------- Pacakges ------------------------

import express, { Request, Response } from 'express'
import { currentUser } from '@baneeem/common'

// -------------------------- Local --------------------------

// -----------------------------------------------------------

const router = express.Router()

router.get(
  '/api/users/currentuser',
  currentUser,
  async (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null })
  }
)

export const currentUserRouter = router
