// ----------------- Packages -------------------------

import { Request, Response, NextFunction } from 'express'

// ----------------- Local -------------------------

import { DatabaseConnectionError, RequestValidationError } from '../errors'

// ----------------------------------------------------

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    console.log('handling error of request')
  }
  if (err instanceof DatabaseConnectionError) {
    console.log('handling error of database')
  }
  res.send({})
}
