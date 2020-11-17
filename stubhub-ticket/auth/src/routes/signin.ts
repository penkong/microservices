// -------------------------- Pacakges ------------------------

import express, { Request, Response } from 'express'
import { BadRequestError, validateRequest } from '@baneeem/common'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

// -------------------------- Local --------------------------

import { Password } from '../services'
import { User } from '../models'

// -----------------------------------------------------------

const router = express.Router()

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('you must provide password')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (!existingUser) {
      throw new BadRequestError('Login Request Failed')
    }

    const matchPassword = await Password.compare(
      existingUser.password,
      password
    )

    if (!matchPassword) throw new BadRequestError('Invalid Credentials!')

    // generate jwt and store it on req.session
    const userJwt = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY!
    )
    // set it on cookie header
    req.session = {
      jwt: userJwt
    }

    res.status(200).send(existingUser)
  }
)

export const signinRouter = router
