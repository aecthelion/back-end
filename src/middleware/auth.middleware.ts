import { IJwtPayload } from '@src/auth/auth.service'
import { RequestHandler } from 'express'
import { promisify } from 'util'
import jwt from 'jsonwebtoken'
import { UnAuthorizedException } from '@src/utils/exceptions'
import config from '@src/config'

const verifyToken = promisify<string, string, IJwtPayload>(jwt.verify as any)

export const authorize: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.slice(7)
  if (!authHeader?.startsWith('Bearer ') || !token) {
    return next(
      new UnAuthorizedException(
        'Authorization header is invalid or token is missing'
      )
    )
  }
  try {
    const decoded = await verifyToken(token, config.get<string>('JWT_SECRET'))
    const { sub, firstName, lastName, email, role } = decoded as IJwtPayload
    req.user = { id: sub, firstName, lastName, email, role }

    next()
  } catch (err) {
    next(err)
  }
}
