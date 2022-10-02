import { StatusCodes } from '@utils/status-codes'
import { HttpException } from '@utils/exceptions/http.exception'

export class ForbiddenException extends HttpException {
  constructor(message: string, errors?: any) {
    super(message, StatusCodes.FORBIDDEN, errors)
  }
}
