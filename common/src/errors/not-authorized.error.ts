// ---------------------- Local ---------------------------

import { CustomError } from './custom.error'

// -----------------------------------------------------------

export class NotAuthorizedError extends CustomError {
  statusCode = 401

  constructor() {
    super('You are not authorized')
    // only because we extending a built in class
    Object.setPrototypeOf(this, NotAuthorizedError.prototype)
  }

  serializeError() {
    return [{ message: 'You are not authorized' }]
  }
}
