// ---------------------- Local ---------------------------

import { CustomError } from './custom.error'

// -----------------------------------------------------------

export class DatabaseConnectionError extends CustomError {
  statusCode = 500
  reason = 'error connection to database'

  constructor() {
    super('error connection to database')
    // only because we extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serializeError() {
    return [{ message: this.reason }]
  }
}
