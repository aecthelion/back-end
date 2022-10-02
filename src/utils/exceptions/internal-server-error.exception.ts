import { StatusCodes } from '@utils/status-codes'
import { HttpException } from '@utils/exceptions/http.exception'

export class InternalServerErrorException extends HttpException {
  constructor(message: string, errors?: any) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, errors)
  }
}
