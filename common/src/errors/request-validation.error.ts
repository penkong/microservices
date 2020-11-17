// ---------------------- Packages ---------------------------

import { ValidationError } from 'express-validator'

// ---------------------- Locals ---------------------------

import { CustomError } from './custom.error'

// -----------------------------------------------------------

export class RequestValidationError extends CustomError {
  statusCode = 400

  constructor(public errors: ValidationError[]) {
    super('Invalid Request Params')
    // only because we extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serializeError() {
    return this.errors.map((er) => ({ message: er.msg, field: er.param }))
  }
}
