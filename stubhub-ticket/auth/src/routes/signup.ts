// -------------------------- Pacakges ------------------------

import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

// -------------------------- Local --------------------------

import { BadRequestError } from '../errors'
import { validateRequest } from '../middlewares'
import { User } from '../models'

// -----------------------------------------------------------

const router = express.Router()

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('must be between 4 and 20')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      throw new BadRequestError('user already exist!')
    }

    const user = User.build({ email, password })
    // we will hash  password on pre save middleware on model
    await user.save()

    // generate jwt and store it on req.session
    const userJwt = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    )

    // set it on cookie header
    req.session = {
      jwt: userJwt
    }

    res.status(201).send(user)
  }
)

export const signupRouter = router
// https://eu.recovery.riotgames.com/
