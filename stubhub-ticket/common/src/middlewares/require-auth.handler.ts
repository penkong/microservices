// ----------------- Packages -------------------------

import { Request, Response, NextFunction } from 'express'

// ----------------- Local -------------------------

import { NotAuthorizedError } from '../errors'

// ----------------------------------------------------

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) throw new NotAuthorizedError()
  next()
}
