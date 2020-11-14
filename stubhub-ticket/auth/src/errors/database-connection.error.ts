// ---------------------- Packages ---------------------------

// import { ValidationError } from 'express-validator'

// -----------------------------------------------------------

export class DatabaseConnectionError extends Error {
  reason = 'error connection to database'
  constructor() {
    super()
    // only because we extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }
}
