import { StatusCodes } from '@utils/status-codes'
import { HttpException } from '@utils/exceptions/http.exception'

export class UnAuthorizedException extends HttpException {
  constructor(message: string, errors?: any) {
    super(message, StatusCodes.UNAUTHORIZED, errors)
  }
}
