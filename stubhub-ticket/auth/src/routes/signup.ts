// -------------------------- Pacakges ------------------------

import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'

// -------------------------- Local --------------------------

import { DatabaseConnectionError, RequestValidationError } from '../errors'

// -----------------------------------------------------------

const router = express.Router()

router.get(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('must be between 4 and 20'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array())
    }
    const { email, password } = req.body
    console.log('creating a user')
    throw new DatabaseConnectionError()
  }
)

export const signupRouter = router
