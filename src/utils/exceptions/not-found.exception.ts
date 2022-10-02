import { StatusCodes } from '@utils/status-codes'
import { HttpException } from '@utils/exceptions/http.exception'

export class NotFoundException extends HttpException {
  constructor(message: string, errors?: any) {
    super(message, StatusCodes.NOT_FOUND, errors)
  }
}
