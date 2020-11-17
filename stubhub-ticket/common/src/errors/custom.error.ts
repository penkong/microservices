export abstract class CustomError extends Error {
  abstract statusCode: number

  constructor(message: string) {
    // for login purpose
    super(message)
    // only because we extending a built in class
    Object.setPrototypeOf(this, CustomError.prototype)
  }

  abstract serializeError(): { message: string; field?: string }[]
}
