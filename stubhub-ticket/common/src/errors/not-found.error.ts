// ---------------------- Locals ---------------------------

import { CustomError } from './custom.error'

// -----------------------------------------------------------

export class NotFoundError extends CustomError {
  statusCode = 404

  constructor() {
    super('Not Found Route')
    // only because we extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serializeError() {
    return [{ message: 'Not Found' }]
  }
}
