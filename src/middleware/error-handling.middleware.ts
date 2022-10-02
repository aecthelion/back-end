import { HttpException, InternalServerErrorException } from '@utils/exceptions'
import { ErrorRequestHandler } from 'express'
import { createLogger } from '@utils/logger'
const logger = createLogger('Error handler')
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err) {
    if (err instanceof HttpException) {
      return res.status(err.code).json(err)
    }
    logger.error('', err)
    const unhandledError = new InternalServerErrorException(err.message)
    res.status(unhandledError.code).json(unhandledError)
  }
}
