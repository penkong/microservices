// ----------------- Packages -------------------------

import { Request, Response, NextFunction } from "express";

// ----------------- Local -------------------------

import { CustomError } from "../errors";

// ----------------------------------------------------

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError)
    return res.status(err.statusCode).send({ errors: err.serializeError() });

  res.status(400).send({ errors: [{ message: "Something wen wrong" }] });
};
