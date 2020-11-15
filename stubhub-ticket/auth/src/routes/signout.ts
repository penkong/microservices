// -------------------------- Pacakges ------------------------

import express, { Request, Response } from 'express'

// -------------------------- Local --------------------------

// -----------------------------------------------------------

const router = express.Router()

router.get('/api/users/signout', (req: Request, res: Response) => {
  req.session = null
  res.send({})
})

export const signoutRouter = router
