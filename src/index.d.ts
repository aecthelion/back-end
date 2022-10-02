declare namespace Express {
  export interface Request {
    user?: {
      id: string
      firstName: string
      lastName: string
      email: string
      role: string
    }
  }
}
