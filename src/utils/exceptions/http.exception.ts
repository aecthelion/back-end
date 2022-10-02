import { StatusCodes } from '@utils/status-codes'

export class HttpException extends Error {
  constructor(
    message: string,
    public readonly code: StatusCodes,
    public readonly errors?: any
  ) {
    super(message)
    Object.setPrototypeOf(this, HttpException.prototype)
  }

  toString() {
    return `Request rejected with status code ${this.code}. \n
    Error message: ${this.message}\n ${
      this.errors
        ? `Additional info : ${JSON.stringify(this.errors, null, 2)}`
        : ''
    }\n
    ${this.stack ? `Stack: ${this.stack}` : ''}`
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
      errors: this.errors
    }
  }
}
