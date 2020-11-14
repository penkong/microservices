// -------------------------- Pacakges ------------------------

import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'

// -------------------------- Local --------------------------

import { RequestValidationError, BadRequestError } from '../errors'
import { User } from '../models'

// -----------------------------------------------------------

const router = express.Router()

router.get(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('must be between 4 and 20')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array())
    }

    const { email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      throw new BadRequestError('user already exist!')
    }

    // we will hash

    const user = User.build({ email, password })
    await user.save()
    res.status(201).send(user)
  }
)

export const signupRouter = router
// https://eu.recovery.riotgames.com/
