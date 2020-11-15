// -------------------------- Pacakges ------------------------

import express, { Request, Response } from 'express'

// -------------------------- Local --------------------------

import { currentUser } from '../middlewares'

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
