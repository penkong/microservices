// -------------------------- Pacakges ------------------------

import express, { Request, Response } from 'express'

// -------------------------- Local --------------------------

// -----------------------------------------------------------

const router = express.Router()

router.post('/api/users/signout', (req: Request, res: Response) => {
  req.session = null
  res.send({})
})

export const signoutRouter = router
