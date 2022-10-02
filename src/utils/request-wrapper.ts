import { RequestHandler, Response, Request, response } from 'express'
import { isPromise } from './is-promise'
import { StatusCodes } from './status-codes'

type ControllerHandler<T> = (
  req: Request<any, any, any, any>,
  res: Response
) => T | Promise<void>

export const requestWrapper = <T>(
  requestHandler: ControllerHandler<T>,
  successStatus = StatusCodes.OK
): RequestHandler => async (req, res, next) => {
  try {
    const requestResult = requestHandler(req, res)

    if (isPromise(requestResult)) {
      const asyncResult = await requestResult

      return res.status(successStatus).json(asyncResult)
    }

    return res.status(successStatus).json(requestResult)
  } catch (error) {
    next(error)
  }
}
